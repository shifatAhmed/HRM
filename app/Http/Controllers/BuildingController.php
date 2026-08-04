<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingController extends Controller
{
    public function index()
    {
        return Inertia::render('Buildings/Index', [
            'buildings' => Building::orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Buildings/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
        ]);

        Building::create($request->only(['name', 'address', 'description']));

        return redirect()->route('buildings.index');
    }

    public function edit(Building $building)
    {
        return Inertia::render('Buildings/Edit', [
            'building' => $building,
        ]);
    }

    public function update(Request $request, Building $building)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
        ]);

        $building->update($request->only(['name', 'address', 'description']));

        return redirect()->route('buildings.index');
    }

    public function destroy(Building $building)
    {
        $building->delete();

        return redirect()->route('buildings.index');
    }
}
