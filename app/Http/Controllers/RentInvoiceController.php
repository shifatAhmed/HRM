<?php

namespace App\Http\Controllers;

use App\Models\Flat;
use App\Models\RentInvoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class RentInvoiceController extends Controller
{
    public function index()
    {
        return Inertia::render('RentInvoices/Index', [
            'invoices' => RentInvoice::with('tenant.flat.building')->orderByDesc('created_at')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('RentInvoices/Create');
    }

    public function store(Request $request)
    {
        $validationRules = [
            'month' => ['required','integer','min:1','max:12'],
            'year' => ['required','integer'],
        ];

        if ($request->filled('tenant_id')) {
            $validationRules['tenant_id'] = ['required','exists:tenants,id'];
            $validationRules['house_rent'] = ['nullable','numeric','min:0'];
            $validationRules['electricity_bill'] = ['nullable','numeric','min:0'];
            $validationRules['gas_bill'] = ['nullable','numeric','min:0'];
            $validationRules['water_bill'] = ['nullable','numeric','min:0'];
            $validationRules['service_charge'] = ['nullable','numeric','min:0'];
            $validationRules['garage_bill'] = ['nullable','numeric','min:0'];
            $validationRules['internet_bill'] = ['nullable','numeric','min:0'];
            $validationRules['other_charges'] = ['nullable','numeric','min:0'];
        }

        $request->validate($validationRules);

        if ($request->filled('tenant_id')) {
            $data = $request->only([
                'tenant_id','month','year','house_rent','electricity_bill','gas_bill','water_bill','service_charge','garage_bill','internet_bill','other_charges'
            ]);

            $total = 0;
            foreach (['house_rent','electricity_bill','gas_bill','water_bill','service_charge','garage_bill','internet_bill','other_charges'] as $key) {
                $total += floatval($data[$key] ?? 0);
            }

            RentInvoice::create(array_merge($data, [
                'total_amount' => $total,
                'paid_amount' => 0,
                'due_amount' => $total,
                'status' => $total > 0 ? 'pending' : 'paid',
            ]));

            return Redirect::route('invoices.create')->with('success', 'Invoice created successfully.');
        }

        $occupiedFlats = Flat::where('status', 'occupied')
            ->with(['tenants' => function ($query) {
                $query->where('status', 'active')->orderBy('id');
            }])
            ->get();

        $createdCount = 0;
        $skippedCount = 0;

        foreach ($occupiedFlats as $flat) {
            $tenant = $flat->tenants->first();

            if (! $tenant) {
                continue;
            }

            $exists = RentInvoice::where('flat_id', $flat->id)
                ->where('year', $request->year)
                ->where('month', $request->month)
                ->exists();

            if ($exists) {
                $skippedCount++;
                continue;
            }

            $houseRent = (float) ($tenant->monthly_rent ?: $flat->rent ?: 0);
            $totalAmount = $houseRent;

            RentInvoice::create([
                'tenant_id' => $tenant->id,
                'flat_id' => $flat->id,
                'month' => $request->month,
                'year' => $request->year,
                'house_rent' => $houseRent,
                'electricity_bill' => 0,
                'gas_bill' => 0,
                'water_bill' => 0,
                'service_charge' => 0,
                'garage_bill' => 0,
                'internet_bill' => 0,
                'other_charges' => 0,
                'total_amount' => $totalAmount,
                'paid_amount' => 0,
                'due_amount' => $totalAmount,
                'status' => $totalAmount > 0 ? 'pending' : 'paid',
            ]);

            $createdCount++;
        }

        if ($createdCount === 0 && $skippedCount > 0) {
            return Redirect::route('invoices.create')->with('warning', 'All invoices for ' . \Carbon\Carbon::create($request->year, $request->month, 1)->format('F Y') . ' have already been generated.');
        }

        if ($createdCount > 0 && $skippedCount > 0) {
            return Redirect::route('invoices.create')->with('success', "Invoice generation completed. {$createdCount} invoices were created and {$skippedCount} existing invoices were skipped.");
        }

        if ($createdCount > 0) {
            return Redirect::route('invoices.create')->with('success', "Invoice generation completed. {$createdCount} invoices were created.");
        }

        return Redirect::route('invoices.create')->with('warning', 'No occupied flats with active tenants were found for this period.');
    }

    public function show(RentInvoice $invoice)
    {
        return Inertia::render('RentInvoices/Show', [
            'invoice' => $invoice->load('tenant.flat.building','payments'),
        ]);
    }

    public function receipt(RentInvoice $invoice)
    {
        $invoice->load('tenant.flat.building','payments');

        // If barryvdh/laravel-dompdf is installed, generate PDF, otherwise return printable HTML
        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.receipt', ['invoice' => $invoice]);
            return $pdf->stream("invoice_{$invoice->id}.pdf");
        }

        return view('invoices.receipt', ['invoice' => $invoice]);
    }
}
