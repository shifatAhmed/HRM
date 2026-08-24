<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Flat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlatController extends Controller
{
    public function index()
    {
        return Inertia::render('Flats/Index', [
            'flats' => Flat::with('building')->orderBy('flat_no')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Flats/Create', [
            'buildings' => Building::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'building_id' => ['required', 'exists:buildings,id'],
            'flat_no' => ['required', 'string', 'max:100'],
            'type' => ['required', 'integer', 'in:1,2'],
            'floor' => ['nullable', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:100'],
            'rent' => ['required', 'numeric', 'min:0'],
            'gas_bill' => ['required', 'numeric', 'min:0'],
            'water_bill' => ['required', 'numeric', 'min:0'],
            'service_charge' => ['required', 'numeric', 'min:0'],
            'electric_meter' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'in:occupied,vacant'],
            'notes' => ['nullable', 'string'],
        ]);

        Flat::create($request->all());

        return redirect()->route('flats.index');
    }

    public function edit(Flat $flat)
    {
        return Inertia::render('Flats/Edit', [
            'flat' => $flat->load('building'),
            'buildings' => Building::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Flat $flat)
    {
        $request->validate([
            'building_id' => ['required', 'exists:buildings,id'],
            'flat_no' => ['required', 'string', 'max:100'],
            'type' => ['required', 'integer', 'in:1,2'],
            'floor' => ['nullable', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:100'],
            'rent' => ['required', 'numeric', 'min:0'],
            'gas_bill' => ['required', 'numeric', 'min:0'],
            'water_bill' => ['required', 'numeric', 'min:0'],
            'service_charge' => ['required', 'numeric', 'min:0'],
            'electric_meter' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'in:occupied,vacant'],
            'notes' => ['nullable', 'string'],
        ]);

        $flat->update($request->all());

        return redirect()->route('flats.index');
    }

    public function destroy(Flat $flat)
    {
        $flat->delete();

        return redirect()->route('flats.index');
    }
}
