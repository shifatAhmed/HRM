<?php

namespace App\Http\Controllers;

use App\Models\Flat;
use App\Models\FamilyMemberDetail;
use App\Models\Tenant;
use App\Services\OpenAiNidService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function scanNid(Request $request, OpenAiNidService $openAiNidService)
    {
        $validated = $request->validate([
            'nid_image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
        ]);

        try {
            return response()->json([
                'data' => $openAiNidService->extract($validated['nid_image']),
            ]);
        } catch (\RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'flat_id' => ['required', 'exists:flats,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'nid' => ['nullable', 'string', 'max:100'],
            'date_of_birth' => ['nullable', 'date'],
            'nid_photo' => ['nullable', 'array'],
            'nid_photo.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5048'],
            'profession' => ['nullable', 'string', 'max:255'],
            'advance_amount' => ['nullable', 'numeric', 'min:0'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'move_in_date' => ['required', 'date'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'family_members_details' => ['nullable', 'array'],
            'family_members_details.*.member_name' => ['nullable', 'string', 'max:255'],
            'family_members_details.*.member_photos' => ['nullable', 'array'],
            'family_members_details.*.member_photos.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        return DB::transaction(function () use ($request) {
            $nidPhotos = $this->storeNidPhotos($request);

            $familyMembersDetails = $this->filterFamilyMembers($request->input('family_members_details', []));
            $familyMembersCount = count($familyMembersDetails);
            if ($familyMembersCount === 0) {
                $familyMembersCount = $request->input('family_members', 0);
            }

            $tenant = Tenant::create(array_merge($request->only([
                'flat_id',
                'name',
                'phone',
                'nid',
                'date_of_birth',
                'profession',
                'advance_amount',
                'monthly_rent',
                'move_in_date',
                'emergency_contact',
                'note',
            ]), [
                'status' => 'active',
                'nid_photo' => $nidPhotos,
                'family_members' => $familyMembersCount,
            ]));

            $this->storeFamilyMembers($request, $tenant);

            $tenant->flat->update(['status' => 'occupied']);

            return redirect()->route('tenants.index')->with('success', 'Tenant added successfully');
        });
    }

    public function show(Tenant $tenant)
    {
        return Inertia::render('Tenants/Show', [
            'tenant' => $tenant->load('flat.building', 'familyMembers'),
        ]);
    }

    public function edit(Tenant $tenant)
    {
        return Inertia::render('Tenants/Edit', [
            'tenant' => $tenant->load('flat.building', 'familyMembers'),
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
            'date_of_birth' => ['nullable', 'date'],
            'nid_photo' => ['nullable', 'array'],
            'nid_photo.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'profession' => ['nullable', 'string', 'max:255'],
            'advance_amount' => ['nullable', 'numeric', 'min:0'],
            'monthly_rent' => ['required', 'numeric', 'min:0'],
            'move_in_date' => ['required', 'date'],
            'status' => ['required', 'in:active,moved_out'],
            'move_out_date' => ['nullable', 'date'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'family_members_details' => ['nullable', 'array'],
            'family_members_details.*.id' => ['nullable', 'integer', 'exists:family_member_details,id'],
            'family_members_details.*.member_name' => ['nullable', 'string', 'max:255'],
            'family_members_details.*.member_photos' => ['nullable', 'array'],
            'family_members_details.*.member_photos.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        return DB::transaction(function () use ($request, $tenant) {
            $nidPhotos = $this->storeNidPhotos($request, $tenant);

            $familyMembersDetails = $this->filterFamilyMembers($request->input('family_members_details', []));
            $familyMembersCount = count($familyMembersDetails);
            if ($familyMembersCount === 0) {
                $familyMembersCount = $request->input('family_members', $tenant->family_members ?? 0);
            }

            $tenant->update(array_merge($request->only([
                'flat_id',
                'name',
                'phone',
                'nid',
                'date_of_birth',
                'profession',
                'advance_amount',
                'monthly_rent',
                'move_in_date',
                'status',
                'move_out_date',
                'emergency_contact',
                'note',
            ]), [
                'nid_photo' => $nidPhotos,
                'family_members' => $familyMembersCount,
            ]));

            $this->syncFamilyMembers($request, $tenant);

            if ($tenant->flat_id !== $request->flat_id) {
                $tenant->flat->update(['status' => 'vacant']);
                Flat::find($request->flat_id)?->update(['status' => 'occupied']);
            }

            if ($request->status === 'moved_out') {
                $tenant->flat->update(['status' => 'vacant']);
            }

            return redirect()->route('tenants.index');
        });
    }

    protected function filterFamilyMembers(array $familyMembers): array
    {
        return array_values(array_filter($familyMembers, function ($member) {
            if (! is_array($member)) {
                return false;
            }

            $name = trim((string) ($member['member_name'] ?? ''));
            $photos = $member['member_photos'] ?? [];

            return $name !== '' || (! empty($photos) && is_array($photos));
        }));
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

    protected function uploadFamilyMemberPhotos(array $photos, int $tenantId): array
    {
        $stored = [];

        foreach ($photos as $photo) {
            if (! $photo) {
                continue;
            }

            $stored[] = $photo->store("family-members/{$tenantId}", 'public');
        }

        return $stored;
    }

    protected function storeFamilyMembers(Request $request, Tenant $tenant): void
    {
        $familyMembers = $this->filterFamilyMembers($request->input('family_members_details', []));
        $familyMemberFiles = $request->file('family_members_details', []);

        foreach ($familyMembers as $index => $member) {
            $photos = [];
            if (isset($familyMemberFiles[$index]['member_photos']) && is_array($familyMemberFiles[$index]['member_photos'])) {
                $photos = $this->uploadFamilyMemberPhotos($familyMemberFiles[$index]['member_photos'], $tenant->id);
            }

            if (blank($member['member_name'] ?? '') && empty($photos)) {
                continue;
            }

            FamilyMemberDetail::create([
                'tenant_id' => $tenant->id,
                'member_name' => $member['member_name'] ?? '',
                'member_photos' => $photos,
            ]);
        }
    }

    protected function deleteFamilyMemberPhotos(FamilyMemberDetail $familyMember): void
    {
        foreach ($familyMember->member_photos ?? [] as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    protected function syncFamilyMembers(Request $request, Tenant $tenant): void
    {
        $familyMembers = $this->filterFamilyMembers($request->input('family_members_details', []));
        $familyMemberFiles = $request->file('family_members_details', []);

        $existingMemberIds = $tenant->familyMembers()->pluck('id')->all();
        $incomingIds = array_filter(array_column($familyMembers, 'id'));
        $deleteIds = array_diff($existingMemberIds, $incomingIds);

        foreach ($deleteIds as $deleteId) {
            $familyMember = FamilyMemberDetail::find($deleteId);
            if ($familyMember) {
                $this->deleteFamilyMemberPhotos($familyMember);
                $familyMember->delete();
            }
        }

        foreach ($familyMembers as $index => $member) {
            $memberPhotos = [];
            if (isset($familyMemberFiles[$index]['member_photos']) && is_array($familyMemberFiles[$index]['member_photos'])) {
                $memberPhotos = $this->uploadFamilyMemberPhotos($familyMemberFiles[$index]['member_photos'], $tenant->id);
            }

            if (! empty($member['id'])) {
                $familyMember = FamilyMemberDetail::find($member['id']);
                if (! $familyMember) {
                    continue;
                }

                $familyMember->member_name = $member['member_name'] ?? $familyMember->member_name;
                if (! empty($memberPhotos)) {
                    $this->deleteFamilyMemberPhotos($familyMember);
                    $familyMember->member_photos = $memberPhotos;
                }
                $familyMember->save();
                continue;
            }

            if (blank($member['member_name'] ?? '') && empty($memberPhotos)) {
                continue;
            }

            FamilyMemberDetail::create([
                'tenant_id' => $tenant->id,
                'member_name' => $member['member_name'] ?? '',
                'member_photos' => $memberPhotos,
            ]);
        }
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->update(['status' => 'moved_out', 'move_out_date' => now()]);
        $tenant->flat->update(['status' => 'vacant']);

        return redirect()->route('tenants.index');
    }
}
