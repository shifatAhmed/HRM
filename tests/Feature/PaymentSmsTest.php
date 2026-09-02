<?php

namespace Tests\Feature;

use App\Models\Building;
use App\Models\Flat;
use App\Models\RentInvoice;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PaymentSmsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_sends_a_notify_bd_sms_after_recording_a_payment(): void
    {
        Http::fake([
            'https://portal.notifybd.com/*' => Http::response(['status' => 'success']),
        ]);
        config([
            'services.notifybd.api_key' => 'test-api-key',
            'services.notifybd.sender_id' => 'HOUSE RENT',
        ]);

        $user = User::factory()->create();
        $building = Building::create(['name' => 'Building A', 'address' => 'Dhaka']);
        $flat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A1',
            'status' => 'occupied',
            'rent' => 5000,
        ]);
        $tenant = Tenant::create([
            'flat_id' => $flat->id,
            'name' => 'Alice',
            'phone' => '01712345678',
            'status' => 'active',
            'monthly_rent' => 5000,
        ]);
        $invoice = RentInvoice::create([
            'tenant_id' => $tenant->id,
            'flat_id' => $flat->id,
            'month' => 9,
            'year' => 2026,
            'house_rent' => 5000,
            'total_amount' => 5000,
            'paid_amount' => 0,
            'due_amount' => 5000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post(route('payments.store'), [
            'invoice_id' => $invoice->id,
            'amount' => 2000,
            'payment_method' => 'cash',
            'payment_date' => '2026-09-02',
        ]);

        $response->assertRedirect();
        Http::assertSent(function ($request) use ($invoice) {
            return $request->url() === 'https://portal.notifybd.com/api/v1/sms/send'
                && $request['api_key'] === 'test-api-key'
                && $request['type'] === 'text'
                && $request['contacts'] === '8801712345678'
                && $request['senderid'] === 'HOUSE RENT'
                && str_contains($request['msg'], "payment of ৳2000.00 received for A1 invoice #{$invoice->id}")
                && str_contains($request['msg'], 'Remaining due: ৳3000.00');
        });
    }
}