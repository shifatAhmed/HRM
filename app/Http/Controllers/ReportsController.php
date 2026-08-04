<?php

namespace App\Http\Controllers;

use App\Models\RentInvoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        $paymentsQuery = Payment::query();
        $invoicesQuery = RentInvoice::query();

        if ($from && $to) {
            $paymentsQuery->whereBetween('payment_date', [$from, $to]);
            $invoicesQuery->whereBetween('created_at', [$from, $to]);
        }

        $collected_total = $paymentsQuery->sum('amount');
        $due_total = RentInvoice::sum('due_amount');

        return Inertia::render('Reports/Index', [
            'collected_total' => $collected_total,
            'due_total' => $due_total,
            'payments' => $paymentsQuery->orderByDesc('payment_date')->limit(50)->get(),
            'invoices' => $invoicesQuery->with('tenant.flat.building')->orderByDesc('created_at')->limit(50)->get(),
        ]);
    }
}
