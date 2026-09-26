<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\TesseractNidService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class TenantNidScanTest extends TestCase
{
    use RefreshDatabase;

    public function test_scan_endpoint_returns_extracted_nid_fields(): void
    {
        $this->mock(TesseractNidService::class, function ($mock): void {
            $mock->shouldReceive('extract')
                ->once()
                ->andReturn([
                    'name' => 'Rahim Uddin',
                    'date_of_birth' => '1990-02-12',
                    'nid' => '1234567890123',
                ]);
        });

        $response = $this->actingAs(User::factory()->create())->postJson(
            route('tenants.scan-nid'),
            ['nid_image' => UploadedFile::fake()->image('nid.jpg')]
        );

        $response->assertOk()->assertExactJson([
            'data' => [
                'name' => 'Rahim Uddin',
                'date_of_birth' => '1990-02-12',
                'nid' => '1234567890123',
            ],
        ]);
    }
}