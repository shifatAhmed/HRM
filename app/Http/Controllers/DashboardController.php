<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Flat;
use App\Models\Payment;
use App\Models\RentInvoice;
use App\Models\Tenant;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'buildings' => Building::count(),
                'flats' => Flat::count(),
                'occupied_flats' => Flat::where('status', 'occupied')->count(),
                'vacant_flats' => Flat::where('status', 'vacant')->count(),
                'tenants' => Tenant::count(),
                'pending_invoices' => RentInvoice::where('status', '!=', 'paid')->count(),
                'due_total' => RentInvoice::sum('due_amount'),
                'collected_total' => Payment::sum('amount'),
            ],
        ]);
    }
}
