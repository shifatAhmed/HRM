<?php

namespace Tests\Feature;

use App\Models\Building;
use App\Models\Flat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_accounts_cannot_read_each_others_business_data(): void
    {
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();

        $this->actingAs($firstUser);
        $firstBuilding = Building::create(['name' => 'First Owner Building']);

        $this->actingAs($secondUser);
        $secondBuilding = Building::create(['name' => 'Second Owner Building']);

        $this->actingAs($firstUser);

        $this->assertTrue(Building::whereKey($firstBuilding->id)->exists());
        $this->assertFalse(Building::whereKey($secondBuilding->id)->exists());
        $this->assertSame(1, Building::count());
    }

    public function test_route_model_binding_cannot_resolve_another_accounts_record(): void
    {
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();

        $this->actingAs($secondUser);
        $building = Building::create(['name' => 'Private Building']);

        $this->actingAs($firstUser);

        $this->get(route('buildings.edit', $building))
            ->assertNotFound();
    }

    public function test_requests_cannot_attach_business_data_from_another_account(): void
    {
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();

        $this->actingAs($secondUser);
        $building = Building::create(['name' => 'Private Building']);

        $this->actingAs($firstUser);

        $this->post(route('flats.store'), [
            'building_id' => $building->id,
            'flat_no' => 'A1',
            'type' => 1,
            'rent' => 5000,
            'gas_bill' => 0,
            'water_bill' => 0,
            'service_charge' => 0,
            'status' => 'vacant',
        ])->assertSessionHasErrors('building_id');

        $this->assertSame(0, Flat::count());
    }
}
