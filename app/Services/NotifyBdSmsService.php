<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotifyBdSmsService
{
    public function send(string $phone, string $message): bool
    {
        $apiKey = config('services.notifybd.api_key');
        $senderId = config('services.notifybd.sender_id');

        if (! $apiKey || ! $senderId) {
            Log::warning('Notify BD SMS was not sent because its credentials are not configured.');

            return false;
        }

        $response = Http::asForm()
            ->timeout(10)
            ->post(config('services.notifybd.url'), [
                'api_key' => $apiKey,
                'type' => config('services.notifybd.type', 'text'),
                'contacts' => $this->formatPhoneNumber($phone),
                'senderid' => $senderId,
                'msg' => $message,
            ]);

        if ($response->failed()) {
            Log::warning('Notify BD SMS request failed.', [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return false;
        }

        return true;
    }

    private function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/[^0-9+]/', '', $phone);

        if (str_starts_with($phone, '+880')) {
            return substr($phone, 1);
        }

        if (str_starts_with($phone, '01')) {
            return '88' . $phone;
        }

        return $phone;
    }
}