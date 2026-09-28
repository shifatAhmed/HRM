<?php

namespace Tests\Feature;

use App\Models\Building;
use App\Models\Flat;
use App\Models\Payment;
use App\Models\RentInvoice;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class DashboardCurrentMonthTotalsTest extends TestCase
{
    use RefreshDatabase;

    public function test_due_and_collected_totals_only_include_the_current_month(): void
    {
        $user = User::factory()->create();
        $building = Building::create(['name' => 'Tower A', 'address' => 'Dhaka']);
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

        $currentMonth = now();
        $previousMonth = $currentMonth->copy()->subMonthNoOverflow();

        $currentInvoice = RentInvoice::create([
            'tenant_id' => $tenant->id,
            'flat_id' => $flat->id,
            'month' => $currentMonth->month,
            'year' => $currentMonth->year,
            'house_rent' => 5000,
            'total_amount' => 5000,
            'paid_amount' => 1000,
            'due_amount' => 4000,
            'status' => 'partial',
        ]);

        $previousInvoice = RentInvoice::create([
            'tenant_id' => $tenant->id,
            'flat_id' => $flat->id,
            'month' => $previousMonth->month,
            'year' => $previousMonth->year,
            'house_rent' => 5000,
            'total_amount' => 5000,
            'paid_amount' => 0,
            'due_amount' => 5000,
            'status' => 'pending',
        ]);

        Payment::create([
            'invoice_id' => $currentInvoice->id,
            'amount' => 1000,
            'payment_method' => 'cash',
            'payment_date' => $currentMonth->toDateString(),
        ]);

        Payment::create([
            'invoice_id' => $previousInvoice->id,
            'amount' => 5000,
            'payment_method' => 'cash',
            'payment_date' => $previousMonth->toDateString(),
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('stats.due_total', 4000)
                ->where('stats.collected_total', 1000)
            );
    }
}
