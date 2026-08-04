<?php

namespace Tests\Feature;

use App\Models\Building;
use App\Models\Flat;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TenantNidPhotoUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_can_be_updated_with_multiple_nid_photos(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $building = Building::create([
            'name' => 'Building A',
            'address' => 'Dhaka',
        ]);
        $flat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A1',
            'status' => 'vacant',
            'rent' => 5000,
        ]);

        $tenant = Tenant::create([
            'flat_id' => $flat->id,
            'name' => 'Old Tenant',
            'phone' => '01700000000',
            'nid' => '1234567890',
            'profession' => 'Engineer',
            'family_members' => 3,
            'advance_amount' => 25000,
            'monthly_rent' => 5000,
            'move_in_date' => '2026-07-01',
            'status' => 'active',
            'emergency_contact' => '01800000000',
            'note' => 'Existing note',
        ]);

        $front = UploadedFile::fake()->image('front.jpg', 400, 300);
        $back = UploadedFile::fake()->image('back.jpg', 400, 300);

        $response = $this->actingAs($user)->patch(route('tenants.update', $tenant->id), [
            'flat_id' => $flat->id,
            'name' => 'Updated Tenant',
            'phone' => '01711111111',
            'nid' => '9999999999',
            'nid_photo' => [$front, $back],
            'profession' => 'Teacher',
            'family_members' => 2,
            'advance_amount' => 30000,
            'monthly_rent' => 5500,
            'move_in_date' => '2026-07-02',
            'status' => 'active',
            'move_out_date' => null,
            'emergency_contact' => '01811111111',
            'note' => 'Updated note',
        ]);

        $response->assertRedirect(route('tenants.index'));

        $tenant->refresh();
        $this->assertSame('Updated Tenant', $tenant->name);
        $this->assertSame('9999999999', $tenant->nid);
        $this->assertCount(2, $tenant->nid_photo ?? []);
    }

    public function test_edit_tenant_page_only_exposes_available_flats_in_dropdown(): void
    {
        $user = User::factory()->create();
        $building = Building::create([
            'name' => 'Building A',
            'address' => 'Dhaka',
        ]);

        $currentFlat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A1',
            'status' => 'occupied',
            'rent' => 5000,
        ]);

        $occupiedFlat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A2',
            'status' => 'occupied',
            'rent' => 6000,
        ]);

        $vacantFlat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A3',
            'status' => 'vacant',
            'rent' => 7000,
        ]);

        $tenant = Tenant::create([
            'flat_id' => $currentFlat->id,
            'name' => 'Alice Tenant',
            'status' => 'active',
            'monthly_rent' => 5000,
            'move_in_date' => '2026-07-01',
        ]);

        $response = $this->actingAs($user)->get(route('tenants.edit', $tenant));

        $response->assertOk();
        $response->assertSee('A1');
        $response->assertSee('A3');
        $response->assertDontSee('A2');
    }

    public function test_tenant_can_upload_multiple_nid_photos(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $building = Building::create([
            'name' => 'Building A',
            'address' => 'Dhaka',
        ]);
        $flat = Flat::create([
            'building_id' => $building->id,
            'flat_no' => 'A1',
            'status' => 'vacant',
            'rent' => 5000,
        ]);

        $front = UploadedFile::fake()->image('front.jpg', 400, 300);
        $back = UploadedFile::fake()->image('back.jpg', 400, 300);

        $response = $this->actingAs($user)->post(route('tenants.store'), [
            'flat_id' => $flat->id,
            'name' => 'Alice Tenant',
            'phone' => '01700000000',
            'nid' => '1234567890',
            'profession' => 'Engineer',
            'family_members' => 3,
            'advance_amount' => 25000,
            'monthly_rent' => 5000,
            'move_in_date' => '2026-07-01',
            'emergency_contact' => '01800000000',
            'note' => 'Need NID documents',
            'nid_photo' => [$front, $back],
        ]);

        $response->assertRedirect(route('tenants.index'));

        $tenant = Tenant::query()->where('name', 'Alice Tenant')->firstOrFail();
        $this->assertNotNull($tenant->nid_photo);
        $savedPaths = $tenant->nid_photo;
        $this->assertCount(2, $savedPaths);
        $this->assertStringStartsWith('tenant-nid-photos/', $savedPaths[0]);
        $this->assertStringStartsWith('tenant-nid-photos/', $savedPaths[1]);
        Storage::disk('public')->assertExists($savedPaths[0]);
        Storage::disk('public')->assertExists($savedPaths[1]);
    }
}
