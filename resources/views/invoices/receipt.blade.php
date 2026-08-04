<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{{ __('Invoice') }} #{{ $invoice->id }}</title>
    <style>
        :root {
            color-scheme: light;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #111827;
            line-height: 1.45;
        }

        body {
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }

        .receipt {
            max-width: 820px;
            margin: 24px auto;
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
        }

        .receipt__header {
            background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
            color: #fff;
            padding: 32px 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .brand__logo {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: rgba(255,255,255,0.18);
            display: grid;
            place-items: center;
        }

        .brand__logo svg {
            width: 30px;
            height: 30px;
            fill: #fff;
        }

        .brand__name {
            font-size: 1.4rem;
            font-weight: 700;
            letter-spacing: -0.04em;
        }

        .brand__subtitle {
            font-size: 0.95rem;
            opacity: 0.85;
        }

        .meta {
            text-align: right;
        }

        .meta span {
            display: block;
            font-size: 0.95rem;
            opacity: 0.92;
            margin-bottom: 6px;
        }

        .receipt__body {
            padding: 36px 42px 42px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section__title {
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: #475569;
            margin-bottom: 16px;
        }

        .grid-two {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
        }

        .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 22px;
        }

        .card strong {
            display: block;
            margin-bottom: 10px;
            font-weight: 700;
            color: #0f172a;
        }

        .card p {
            margin: 0;
            color: #475569;
            font-size: 0.95rem;
        }

        .invoice-table {
            width: 100%;
            border-collapse: collapse;
        }

        .invoice-table th,
        .invoice-table td {
            border-bottom: 1px solid #e2e8f0;
            padding: 16px 12px;
            font-size: 0.95rem;
        }

        .invoice-table th {
            color: #475569;
            font-weight: 700;
            text-transform: uppercase;
        }

        .invoice-table td.amount {
            text-align: right;
        }

        .summary {
            display: grid;
            grid-template-columns: 1fr 285px;
            gap: 18px;
            align-items: start;
        }

        .summary__card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 24px;
        }

        .summary__item {
            display: flex;
            justify-content: space-between;
            font-size: 0.95rem;
            color: #475569;
            margin-bottom: 14px;
        }

        .summary__item strong {
            color: #0f172a;
        }

        .summary__item:last-child {
            margin-bottom: 0;
            font-weight: 700;
        }

        .payments-list {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e2e8f0;
        }

        .payments-list li {
            margin-bottom: 10px;
            color: #475569;
            font-size: 0.95rem;
        }

        .print-actions {
            margin-top: 26px;
            display: inline-flex;
            gap: 12px;
        }

        .print-button {
            background: #1d4ed8;
            color: white;
            border: none;
            border-radius: 9999px;
            padding: 14px 24px;
            cursor: pointer;
            font-weight: 700;
            letter-spacing: 0.02em;
        }

        @media print {
            body { background: #fff; }
            .receipt { box-shadow: none; margin: 0; border-radius: 0; }
            .print-actions { display: none; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="receipt__header">
            <div class="brand">
                <div class="brand__logo" aria-hidden="true">
                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 36L24 12l12 24H12Z" />
                    </svg>
                </div>
                <div>
                    <div class="brand__name">{{ config('app.name', 'House Rent') }}</div>
                    <div class="brand__subtitle">{{ __('Flat Rent Management System') }}</div>
                </div>
            </div>
            <div class="meta">
                <span>{{ __('Invoice') }} #{{ $invoice->id }}</span>
                <span>{{ __('Date') }}: {{ $invoice->created_at->format('Y-m-d') }}</span>
                <span>{{ __('Rental Month') }}: {{ \Carbon\Carbon::create($invoice->year, $invoice->month, 1)->format('F Y') }}</span>
            </div>
        </div>

        <div class="receipt__body">
            <div class="section">
                <div class="section__title">{{ __('Tenant Details') }}</div>
                <div class="grid-two">
                    <div class="card">
                        <strong>{{ __('Tenant') }}</strong>
                        <p>{{ $invoice->tenant->name }}</p>
                        <p>{{ $invoice->tenant->phone }}</p>
                        <p>{{ $invoice->tenant->nid ?? __('NID not provided') }}</p>
                    </div>
                    <div class="card">
                        <strong>{{ __('Property') }}</strong>
                        <p>{{ $invoice->tenant->flat->flat_no }} — {{ $invoice->tenant->flat->building->name ?? __('Building not set') }}</p>
                        <p>{{ __('Floor') }}: {{ $invoice->tenant->flat->floor ?? __('N/A') }}</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section__title">{{ __('Invoice Details') }}</div>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>{{ __('Particulars') }}</th>
                            <th class="amount">{{ __('Amount') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if($invoice->house_rent)
                        <tr><td>{{ __('House Rent') }}</td><td class="amount">৳{{ number_format($invoice->house_rent,2) }}</td></tr>
                        @endif
                        @if($invoice->electricity_bill)
                        <tr><td>{{ __('Electricity') }}</td><td class="amount">৳{{ number_format($invoice->electricity_bill,2) }}</td></tr>
                        @endif
                        @if($invoice->gas_bill)
                        <tr><td>{{ __('Gas') }}</td><td class="amount">৳{{ number_format($invoice->gas_bill,2) }}</td></tr>
                        @endif
                        @if($invoice->water_bill)
                        <tr><td>{{ __('Water') }}</td><td class="amount">৳{{ number_format($invoice->water_bill,2) }}</td></tr>
                        @endif
                        @if($invoice->service_charge)
                        <tr><td>{{ __('Service Charge') }}</td><td class="amount">৳{{ number_format($invoice->service_charge,2) }}</td></tr>
                        @endif
                        @if($invoice->garage_bill)
                        <tr><td>{{ __('Garage') }}</td><td class="amount">৳{{ number_format($invoice->garage_bill,2) }}</td></tr>
                        @endif
                        @if($invoice->internet_bill)
                        <tr><td>{{ __('Internet') }}</td><td class="amount">৳{{ number_format($invoice->internet_bill,2) }}</td></tr>
                        @endif
                        @if($invoice->other_charges)
                        <tr><td>{{ __('Other Charges') }}</td><td class="amount">৳{{ number_format($invoice->other_charges,2) }}</td></tr>
                        @endif
                    </tbody>
                </table>
            </div>

            <div class="section">
                <div class="section__title">{{ __('Summary') }}</div>
                <div class="summary">
                    <div class="summary__card">
                        <div class="summary__item"><span>{{ __('Total Amount') }}</span><strong>৳{{ number_format($invoice->total_amount,2) }}</strong></div>
                        <div class="summary__item"><span>{{ __('Paid Amount') }}</span><strong>৳{{ number_format($invoice->paid_amount,2) }}</strong></div>
                        <div class="summary__item"><span>{{ __('Due Amount') }}</span><strong>৳{{ number_format($invoice->due_amount,2) }}</strong></div>
                        <div class="summary__item"><span>{{ __('Status') }}</span><strong>{{ ucfirst($invoice->status) }}</strong></div>
                    </div>
                    <div>
                        <div class="section__title">{{ __('Payment History') }}</div>
                        <ul class="payments-list">
                            @forelse($invoice->payments as $payment)
                                <li>{{ $payment->payment_date }} — ৳{{ number_format($payment->amount,2) }} — {{ ucfirst($payment->payment_method) }}</li>
                            @empty
                                <li>{{ __('No payments recorded yet.') }}</li>
                            @endforelse
                        </ul>
                    </div>
                </div>
            </div>

            <div class="print-actions">
                <button type="button" class="print-button" onclick="window.print()">{{ __('Print Receipt') }}</button>
            </div>
        </div>
    </div>
</body>
</html>
