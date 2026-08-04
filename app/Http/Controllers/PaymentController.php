<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\RentInvoice;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'invoice_id' => ['required','exists:rent_invoices,id'],
            'amount' => ['required','numeric','min:0.01'],
            'payment_method' => ['required','string'],
            'payment_date' => ['required','date'],
        ]);

        $invoice = RentInvoice::findOrFail($request->invoice_id);

        $payment = Payment::create([
            'invoice_id' => $invoice->id,
            'payment_method' => $request->payment_method,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'note' => $request->note ?? null,
        ]);

        $invoice->paid_amount += $payment->amount;
        $invoice->due_amount = max(0, $invoice->total_amount - $invoice->paid_amount);
        if ($invoice->due_amount <= 0) {
            $invoice->status = 'paid';
        } elseif ($invoice->paid_amount > 0) {
            $invoice->status = 'partial';
        }
        $invoice->save();

        return redirect()->back();
    }
}
