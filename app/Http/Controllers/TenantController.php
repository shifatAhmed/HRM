<?php

namespace App\Http\Controllers;

use App\Models\Flat;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        return Inertia::render('Tenants/Index', [
            'tenants' => Tenant::with('flat.building')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Tenants/Create', [
            'flats' => Flat::where('status', 'vacant')->with('building')->orderBy('flat_no')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'flat_id' => ['required', 'exists:flats,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'nid' => ['nullable', 'string', 'max:100'],
            'nid_photo' => ['nullable', 'array'],
            'nid_photo.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'profession' => ['nullable', 'string', 'max:255'],
            'family_members' => ['nullable', 'integer', 'min:0'],
            'advance_amount' => ['nullable', 'numeric', 'min:0'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'move_in_date' => ['required', 'date'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
        ]);

        $nidPhotos = $this->storeNidPhotos($request);

        $tenant = Tenant::create(array_merge($request->only([
            'flat_id',
            'name',
            'phone',
            'nid',
            'profession',
            'family_members',
            'advance_amount',
            'monthly_rent',
            'move_in_date',
            'emergency_contact',
            'note',
        ]), [
            'status' => 'active',
            'nid_photo' => $nidPhotos,
        ]));

        $tenant->flat->update(['status' => 'occupied']);

        return redirect()->route('tenants.index');
    }

    public function edit(Tenant $tenant)
    {
        return Inertia::render('Tenants/Edit', [
            'tenant' => $tenant->load('flat.building'),
            'flats' => Flat::with('building')
                ->where(function ($query) use ($tenant) {
                    $query->where('status', 'vacant')
                        ->orWhere('id', $tenant->flat_id);
                })
                ->orderBy('flat_no')
                ->get(),
        ]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $request->validate([
            'flat_id' => ['required', 'exists:flats,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'nid' => ['nullable', 'string', 'max:100'],
            'nid_photo' => ['nullable', 'array'],
            'nid_photo.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'profession' => ['nullable', 'string', 'max:255'],
            'family_members' => ['nullable', 'integer', 'min:0'],
            'advance_amount' => ['nullable', 'numeric', 'min:0'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'move_in_date' => ['required', 'date'],
            'status' => ['required', 'in:active,moved_out'],
            'move_out_date' => ['nullable', 'date'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
        ]);

        $nidPhotos = $this->storeNidPhotos($request, $tenant);

        $tenant->update(array_merge($request->only([
            'flat_id',
            'name',
            'phone',
            'nid',
            'profession',
            'family_members',
            'advance_amount',
            'monthly_rent',
            'move_in_date',
            'status',
            'move_out_date',
            'emergency_contact',
            'note',
        ]), [
            'nid_photo' => $nidPhotos,
        ]));

        if ($tenant->flat_id !== $request->flat_id) {
            $tenant->flat->update(['status' => 'vacant']);
            Flat::find($request->flat_id)?->update(['status' => 'occupied']);
        }

        if ($request->status === 'moved_out') {
            $tenant->flat->update(['status' => 'vacant']);
        }

        return redirect()->route('tenants.index');
    }

    protected function storeNidPhotos(Request $request, ?Tenant $tenant = null): ?array
    {
        $nidPhotos = [];

        foreach ($request->file('nid_photo', []) as $photo) {
            if (! $photo) {
                continue;
            }

            $path = $photo->store('tenant-nid-photos', 'public');
            $nidPhotos[] = $path;
        }

        if (empty($nidPhotos) && $tenant) {
            return $tenant->nid_photo ?? null;
        }

        if (! empty($nidPhotos)) {
            return $nidPhotos;
        }

        return null;
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->update(['status' => 'moved_out', 'move_out_date' => now()]);
        $tenant->flat->update(['status' => 'vacant']);

        return redirect()->route('tenants.index');
    }
}
