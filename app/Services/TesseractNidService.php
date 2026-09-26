<?php

namespace App\Services;

use DateTimeImmutable;
use Illuminate\Http\UploadedFile;
use RuntimeException;
use Symfony\Component\Process\Exception\ExecutableNotFoundException;
use Symfony\Component\Process\Process;

class TesseractNidService
{
    public function extract(UploadedFile $image): array
    {
        $language = (string) config('services.tesseract.language', 'eng');
        $process = $this->runOcr($image, $language);

        if (! $process->isSuccessful()
            && $language !== 'eng'
            && preg_match('/failed loading language|error opening data file|could not initialize tesseract/i', $process->getErrorOutput())) {
            $process = $this->runOcr($image, 'eng');
        }

        if (! $process->isSuccessful()) {
            $errorOutput = trim($process->getErrorOutput());
            logger()->warning('Tesseract failed to read an NID image.', [
                'exit_code' => $process->getExitCode(),
                'error' => $errorOutput,
            ]);

            if (preg_match('/not recognized as an internal or external command|cannot find the file specified/i', $errorOutput)) {
                throw new RuntimeException('Tesseract executable was not found. Install Tesseract and set TESSERACT_BINARY to the full path of tesseract.exe.');
            }

            if (preg_match('/failed loading language|error opening data file|could not initialize tesseract/i', $errorOutput)) {
                throw new RuntimeException('Tesseract language data is missing. Set TESSERACT_LANGUAGE=eng or install the configured language data.');
            }

            throw new RuntimeException('Tesseract OCR failed. Check the Laravel log for the Tesseract diagnostic.');
        }

        $details = $this->parseText($process->getOutput());
        if ($details['name'] === '') {
            $alternateProcess = $this->runOcr($image, $language, 11);
            if ($alternateProcess->isSuccessful()) {
                $alternateDetails = $this->parseText($alternateProcess->getOutput());
                $details['name'] = $alternateDetails['name'];
                $details['date_of_birth'] = $details['date_of_birth'] ?: $alternateDetails['date_of_birth'];
                $details['nid'] = $details['nid'] ?: $alternateDetails['nid'];
            }
        }

        if ($details['name'] === '' && $details['date_of_birth'] === '' && $details['nid'] === '') {
            throw new RuntimeException('No NID details were recognized. Try a clearer image with the NID text in focus.');
        }

        return $details;
    }

    private function runOcr(UploadedFile $image, string $language, int $pageSegmentationMode = 6): Process
    {
        $process = new Process([
            (string) config('services.tesseract.binary', 'tesseract'),
            $image->getRealPath(),
            'stdout',
            '-l',
            $language,
            '--psm',
            (string) $pageSegmentationMode,
        ]);
        $process->setTimeout(30);

        try {
            $process->run();
        } catch (ExecutableNotFoundException) {
            throw new RuntimeException('Tesseract OCR is not installed or configured. Install Tesseract and set TESSERACT_BINARY.');
        }

        return $process;
    }

    public function parseText(string $text): array
    {
        $text = strtr($text, [
            '০' => '0', '১' => '1', '২' => '2', '৩' => '3', '৪' => '4',
            '৫' => '5', '৬' => '6', '৭' => '7', '৮' => '8', '৯' => '9',
        ]);
        $lines = array_values(array_filter(array_map('trim', preg_split('/\R/u', $text) ?: [])));

        return [
            'name' => $this->extractName($lines),
            'date_of_birth' => $this->extractDateOfBirth($lines),
            'nid' => $this->extractNid($lines),
        ];
    }

    private function extractName(array $lines): string
    {
        $labelPattern = '/(?:^|[^\p{L}])((?:name|নাম))(?=$|[^\p{L}])/iu';

        foreach ($lines as $index => $line) {
            if (! preg_match($labelPattern, $line, $matches, PREG_OFFSET_CAPTURE)) {
                continue;
            }

            $label = $matches[1][0];
            $name = $this->cleanNameCandidate(substr($line, $matches[1][1] + strlen($label)));
            if ($name !== '') {
                return $name;
            }

            foreach ([1, 2, -1] as $offset) {
                $name = $this->cleanNameCandidate($lines[$index + $offset] ?? '');
                if ($name !== '') {
                    return $name;
                }
            }
        }

        foreach ($lines as $line) {
            if (preg_match('/^(?:father|mother|date|dob|nid|পিতা|মাতা|জন্ম)\b/iu', $line)) {
                break;
            }

            $candidate = $this->cleanNameCandidate($line);
            if ($candidate !== ''
                && preg_match('/^[A-Z][A-Za-z .\'’\-]*$/u', $candidate) === 1
                && preg_match('/\b(?:government|people|republic|bangladesh|national|identity|card|date|birth|father|mother|name|nid)\b/i', $candidate) !== 1
                && preg_match('/\s/u', $candidate) === 1) {
                return $candidate;
            }
        }

        return '';
    }

    private function cleanNameCandidate(string $candidate): string
    {
        $candidate = trim($candidate, " \t\n\r\0\x0B:|#-");

        if ($candidate === ''
            || strlen($candidate) > 100
            || preg_match('/^(?:name|father|mother|date|dob|nid)$/iu', $candidate) === 1
            || preg_match('/^[\p{L}][\p{L}\p{M} .\'’\-]*$/u', $candidate) !== 1
            || preg_match('/\b(?:date|dob|nid|father|mother|blood|জন্ম|পিতা|মাতা)\b/iu', $candidate) === 1) {
            return '';
        }

        return trim($candidate);
    }

    private function extractDateOfBirth(array $lines): string
    {
        $labelledLines = array_values(array_filter(
            $lines,
            fn (string $line): bool => preg_match('/date|dob|জন্ম/u', $line) === 1
        ));

        foreach ([...$labelledLines, ...$lines] as $line) {
            if (preg_match('/\b(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})\b/u', $line, $match)) {
                return $this->validDate((int) $match[1], (int) $match[2], (int) $match[3]);
            }

            if (preg_match('/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})\b/u', $line, $match)) {
                return $this->validDate((int) $match[3], (int) $match[2], (int) $match[1]);
            }

            if (preg_match('/\b(\d{1,2})\s+([A-Za-z]{3,9})\.?\s+(\d{4})\b/u', $line, $match)) {
                $date = DateTimeImmutable::createFromFormat('!j M Y', $match[1].' '.$match[2].' '.$match[3]);
                if ($date !== false) {
                    return $date->format('Y-m-d');
                }
            }
        }

        return '';
    }

    private function extractNid(array $lines): string
    {
        $nidLines = array_values(array_filter(
            $lines,
            fn (string $line): bool => preg_match('/nid|জাতীয় পরিচয়পত্র|জাতীয় পরিচয়পত্র|এনআইডি/iu', $line) === 1
        ));

        foreach ([...$nidLines, ...$lines] as $line) {
            preg_match_all('/[\p{N}][\p{N}\s-]{8,23}[\p{N}]/u', $line, $matches);
            foreach ($matches[0] ?? [] as $candidate) {
                $digits = preg_replace('/\D/u', '', $candidate) ?? '';
                if (in_array(strlen($digits), [10, 13, 17], true)) {
                    return $digits;
                }
            }
        }

        return '';
    }

    private function validDate(int $year, int $month, int $day): string
    {
        return checkdate($month, $day, $year)
            ? sprintf('%04d-%02d-%02d', $year, $month, $day)
            : '';
    }
}
