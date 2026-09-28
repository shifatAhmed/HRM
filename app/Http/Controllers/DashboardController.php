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
        $currentMonth = now();

        return Inertia::render('Dashboard', [
            'stats' => [
                'buildings' => Building::count(),
                'flats' => Flat::count(),
                'occupied_flats' => Flat::where('status', 'occupied')->count(),
                'vacant_flats' => Flat::where('status', 'vacant')->count(),
                'tenants' => Tenant::count(),
                'pending_invoices' => RentInvoice::where('status', '!=', 'paid')->count(),
                'due_total' => RentInvoice::where('month', $currentMonth->month)
                    ->where('year', $currentMonth->year)
                    ->sum('due_amount'),
                'collected_total' => Payment::whereMonth('payment_date', $currentMonth->month)
                    ->whereYear('payment_date', $currentMonth->year)
                    ->sum('amount'),
            ],
        ]);
    }
}
