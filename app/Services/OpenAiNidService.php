<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiNidService
{
    public function extract(UploadedFile $image): array
    {
        $apiKey = config('services.openai.api_key');

        if (blank($apiKey)) {
            throw new RuntimeException('OpenAI is not configured. Add OPENAI_API_KEY to the environment.');
        }

        $imageData = base64_encode(file_get_contents($image->getRealPath()));
        $mimeType = $image->getMimeType() ?: 'image/jpeg';

        try {
            $response = Http::withToken($apiKey)
                ->acceptJson()
                ->timeout(60)
                ->post('https://api.openai.com/v1/responses', [
                    'model' => config('services.openai.model', 'gpt-4o-mini'),
                    'input' => [[
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'input_text',
                                'text' => 'Read this Bangladesh National ID card. Return only the requested fields. Use English transliteration when a Bangla name is also present. Convert the date of birth to YYYY-MM-DD. Use an empty string when a value is missing or uncertain.',
                            ],
                            [
                                'type' => 'input_image',
                                'image_url' => "data:{$mimeType};base64,{$imageData}",
                            ],
                        ],
                    ]],
                    'text' => [
                        'format' => [
                            'type' => 'json_schema',
                            'name' => 'nid_details',
                            'strict' => true,
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'name' => ['type' => 'string'],
                                    'date_of_birth' => ['type' => 'string'],
                                    'nid' => ['type' => 'string'],
                                ],
                                'required' => ['name', 'date_of_birth', 'nid'],
                                'additionalProperties' => false,
                            ],
                        ],
                    ],
                ]);

            if ($response->failed()) {
                report($response->toException());

                if ($response->status() === 429 && str_contains(strtolower($response->body()), 'credits')) {
                    throw new RuntimeException('The OpenAI account has no credits remaining. Add billing credits to continue reading NID images.');
                }

                throw new RuntimeException('OpenAI could not read the NID image. Please try again later.');
            }
        } catch (RequestException $exception) {
            report($exception);
            throw new RuntimeException('OpenAI could not read the NID image. Please try a clearer image.');
        }

        $result = $this->responseText($response->json());
        $details = json_decode($result, true);

        if (! is_array($details)) {
            throw new RuntimeException('OpenAI returned an unreadable result. Please try again.');
        }

        return [
            'name' => trim((string) ($details['name'] ?? '')),
            'date_of_birth' => trim((string) ($details['date_of_birth'] ?? '')),
            'nid' => trim((string) ($details['nid'] ?? '')),
        ];
    }

    protected function responseText(array $response): string
    {
        if (isset($response['output_text']) && is_string($response['output_text'])) {
            return $response['output_text'];
        }

        foreach ($response['output'] ?? [] as $output) {
            foreach ($output['content'] ?? [] as $content) {
                if (isset($content['text']) && is_string($content['text'])) {
                    return $content['text'];
                }
            }
        }

        return '';
    }
}
