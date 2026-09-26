<?php

namespace Tests\Unit;

use App\Services\TesseractNidService;
use PHPUnit\Framework\TestCase;

class TesseractNidServiceTest extends TestCase
{
    public function test_it_extracts_english_nid_fields_from_ocr_text(): void
    {
        $details = (new TesseractNidService())->parseText(<<<'OCR'
Name: Rahim Uddin
Date of Birth: 12 Feb 1990
NID No: 1234567890123
OCR);

        $this->assertSame([
            'name' => 'Rahim Uddin',
            'date_of_birth' => '1990-02-12',
            'nid' => '1234567890123',
        ], $details);
    }

    public function test_it_extracts_fields_from_the_attached_card_layout(): void
    {
        $details = (new TesseractNidService())->parseText(<<<'OCR'
Name
SIFAT AHMED
Date of Birth 31 Dec 1995
NID No. 240 232 9821
OCR);

        $this->assertSame([
            'name' => 'SIFAT AHMED',
            'date_of_birth' => '1995-12-31',
            'nid' => '2402329821',
        ], $details);
    }

    public function test_it_finds_a_name_after_a_prefixed_ocr_label(): void
    {
        $details = (new TesseractNidService())->parseText(<<<'OCR'
National ID Card | Name:
SIFAT AHMED
Date of Birth 31 Dec 1995
NID No. 240 232 9821
OCR);

        $this->assertSame('SIFAT AHMED', $details['name']);
    }

    public function test_it_finds_an_english_name_when_ocr_omits_the_name_label(): void
    {
        $details = (new TesseractNidService())->parseText(<<<'OCR'
Government of the People's Republic of Bangladesh
National ID Card
SIFAT AHMED
Father
SULTAN AHMED
Date of Birth 31 Dec 1995
NID No. 240 232 9821
OCR);

        $this->assertSame('SIFAT AHMED', $details['name']);
    }

    public function test_it_accepts_title_case_names_when_ocr_omits_the_label(): void
    {
        $details = (new TesseractNidService())->parseText(<<<'OCR'
National ID Card
Sifat Ahmed
Date of Birth 31 Dec 1995
NID No. 240 232 9821
OCR);

        $this->assertSame('Sifat Ahmed', $details['name']);
    }

    public function test_it_normalizes_bangla_digits_and_uses_numeric_birth_dates(): void
    {
        $details = (new TesseractNidService())->parseText(<<<'OCR'
নাম: করিম
জন্ম তারিখ: ০১/০২/১৯৯০
NID: ১৯৮৭৬৫৪৩২১০৯৮
OCR);

        $this->assertSame([
            'name' => 'করিম',
            'date_of_birth' => '1990-02-01',
            'nid' => '1987654321098',
        ], $details);
    }

    public function test_it_ignores_invalid_birth_dates_and_unrecognized_nid_numbers(): void
    {
        $details = (new TesseractNidService())->parseText(<<<'OCR'
Name: Sample Person
Date of Birth: 31/02/1990
NID No: 12345
OCR);

        $this->assertSame([
            'name' => 'Sample Person',
            'date_of_birth' => '',
            'nid' => '',
        ], $details);
    }
}
