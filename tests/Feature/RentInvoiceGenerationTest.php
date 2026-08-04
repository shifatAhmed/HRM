<?php

namespace Tests\Feature;

use App\Models\Building;
use App\Models\Flat;
use App\Models\RentInvoice;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RentInvoiceGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_invoices_for_occupied_flats_and_skips_existing_ones(): void
    {
        $user = User::factory()->create();
        $building = Building::create(['name' => 'Building A', 'address' => 'Test Address']);

        $firstFlat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A1',
            'status' => 'occupied',
            'rent' => 5000,
        ]);

        $secondFlat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A2',
            'status' => 'occupied',
            'rent' => 6000,
        ]);

        $firstTenant = Tenant::create([
            'flat_id' => $firstFlat->id,
            'name' => 'Alice',
            'status' => 'active',
            'monthly_rent' => 5000,
        ]);

        $secondTenant = Tenant::create([
            'flat_id' => $secondFlat->id,
            'name' => 'Bob',
            'status' => 'active',
            'monthly_rent' => 6000,
        ]);

        RentInvoice::create([
            'tenant_id' => $firstTenant->id,
            'flat_id' => $firstFlat->id,
            'month' => 7,
            'year' => 2026,
            'house_rent' => 5000,
            'total_amount' => 5000,
            'paid_amount' => 0,
            'due_amount' => 5000,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post(route('invoices.store'), [
            'month' => 7,
            'year' => 2026,
        ]);

        $response->assertRedirect(route('invoices.create'));
        $response->assertSessionHas('success', 'Invoice generation completed. 1 invoices were created and 1 existing invoices were skipped.');
        $this->assertDatabaseCount('rent_invoices', 2);
        $this->assertDatabaseHas('rent_invoices', [
            'flat_id' => $firstFlat->id,
            'tenant_id' => $firstTenant->id,
            'month' => 7,
            'year' => 2026,
        ]);
        $this->assertDatabaseHas('rent_invoices', [
            'flat_id' => $secondFlat->id,
            'tenant_id' => $secondTenant->id,
            'month' => 7,
            'year' => 2026,
        ]);
    }
}
