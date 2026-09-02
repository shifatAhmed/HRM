<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{{ __('Invoice') }} #{{ $invoice->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f5f5f5;
            line-height: 1.6;
        }

        .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        /* Header Section */
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            border-bottom: 3px solid #156842;
            padding-bottom: 10px;
        }

        .company-info {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            flex: 1;
        }

        .company-logo {
            width: 45px;
            height: 45px;
            background-color: #156842;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            flex-shrink: 0;
        }

        .company-details h1 {
            color: #156842;
            font-size: 18px;
            margin-bottom: 2px;
        }

        .company-details p {
            color: #666;
            font-size: 10px;
            margin: 1px 0;
        }

        .invoice-badge {
            background-color: #156842;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            min-width: 70px;
        }

        .invoice-meta {
            text-align: right;
        }

        .invoice-meta-item {
            margin-bottom: 3px;
            font-size: 10px;
        }

        .invoice-meta-item strong {
            color: #156842;
            display: inline-block;
            width: 85px;
        }

        /* Information Sections */
        .info-sections {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 12px;
        }

        .info-section h3 {
            color: #156842;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 6px;
            text-transform: uppercase;
            border-bottom: 2px solid #156842;
            padding-bottom: 4px;
        }

        .info-section p {
            font-size: 10px;
            margin-bottom: 2px;
            color: #333;
            line-height: 1.3;
        }

        .info-section strong {
            display: inline-block;
            width: 85px;
            color: #156842;
        }

        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .items-table thead {
            background-color: #156842;
            color: white;
        }

        .items-table th {
            padding: 6px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .items-table th:last-child {
            text-align: right;
            padding-right: 12px;
        }

        .items-table td {
            padding: 5px 6px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 10px;
        }

        .items-table td:last-child {
            text-align: right;
            padding-right: 12px;
        }

        .items-table tbody tr:hover {
            background-color: #f9f9f9;
        }

        .items-table tfoot tr {
            font-weight: bold;
            background-color: #f5f5f5;
        }

        .items-table tfoot td {
            border-bottom: 2px solid #156842;
            border-top: 2px solid #156842;
            padding: 5px 6px;
            font-size: 10px;
        }

        /* Payment History */
        .payment-history {
            margin-bottom: 8px;
        }

        .payment-history h3 {
            color: #156842;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 6px;
            text-transform: uppercase;
            border-bottom: 2px solid #156842;
            padding-bottom: 4px;
        }

        .payment-table {
            width: 100%;
            border-collapse: collapse;
        }

        .payment-table thead {
            background-color: #f0f0f0;
        }

        .payment-table th {
            padding: 5px 6px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            border-bottom: 1px solid #156842;
            color: #156842;
        }

        .payment-table td {
            padding: 4px 6px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 9px;
        }

        .payment-table td:last-child {
            text-align: right;
        }

        .payment-table tfoot tr {
            font-weight: bold;
            background-color: #f9f9f9;
        }

        .payment-table tfoot td {
            border-top: 2px solid #156842;
            border-bottom: 1px solid #156842;
            padding: 4px 6px;
            font-size: 9px;
        }

        .payment-table tfoot td:last-child {
            text-align: right;
        }

        /* Signature Section */
        .signature-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: center;
        }

        .signature-box {
            text-align: center;
        }

        .signature-line {
            width: 150px;
            border-top: 1px solid #333;
            margin: 30px 0 2px 0;
        }

        .signature-box p {
            font-size: 10px;
            color: #666;
            font-weight: bold;
            margin: 2px 0;
        }

        .print-actions {
            margin-top: 10px;
            text-align: center;
        }

        .print-button {
            background-color: #156842;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 11px;
        }

        .print-button:hover {
            background-color: #0d4030;
        }

        @media print {
            body {
                background-color: white;
                margin: 0;
                padding: 0;
            }
            .invoice-container {
                box-shadow: none;
                margin: 0;
                padding: 10px;
                max-width: 100%;
            }
            .print-actions {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <div class="company-info">
                <div class="company-logo">🏢</div>
                <div class="company-details">
                    <h1>{{ config('app.name', 'House Rent') }}</h1>
                    <p>{{ __('House Rent Management System') }}</p>
                    <p>📍 Road-12, Block-A, Bashundhara R/A, Dhaka-1229</p>
                    <p>📞 01712-345678, 01898-765432</p>
                </div>
            </div>
            <div style="text-align: center;">
                <div class="invoice-badge">INVOICE</div>
                <div class="invoice-meta">
                    <div class="invoice-meta-item"><strong>Invoice No:</strong> INV-{{ str_pad($invoice->year, 4, '0', STR_PAD_LEFT) }}-{{ str_pad($invoice->month, 2, '0', STR_PAD_LEFT) }}-{{ str_pad($invoice->id, 4, '0', STR_PAD_LEFT) }}</div>
                    <div class="invoice-meta-item"><strong>Invoice Date:</strong> {{ $invoice->created_at->format('d F Y') }}</div>
                    <div class="invoice-meta-item"><strong>For Month:</strong> {{ \Carbon\Carbon::create($invoice->year, $invoice->month, 1)->format('F Y') }}</div>
                </div>
            </div>
        </div>

        <!-- Tenant and Unit Information -->
        <div class="info-sections">
            <div class="info-section">
                <h3>Tenant Information</h3>
                <p><strong>Tenant Name:</strong> {{ $invoice->tenant->name }}</p>
                <p><strong>Phone:</strong> {{ $invoice->tenant->phone }}</p>
                <p><strong>NID No.:</strong> {{ $invoice->tenant->nid ?? 'N/A' }}</p>
                <p><strong>Address:</strong> {{ $invoice->tenant->flat->flat_no }}, {{ $invoice->tenant->flat->building->name ?? 'Building not set' }}<br>Road-12, Block-A, Bashundhara R/A, Dhaka</p>
            </div>
            <div class="info-section">
                <h3>Unit Information</h3>
                <p><strong>Unit Type:</strong> Flat</p>
                <p><strong>Unit No.:</strong> {{ $invoice->tenant->flat->flat_no }}</p>
                <p><strong>Floor:</strong> {{ $invoice->tenant->flat->floor ?? 'N/A' }}</p>
                <p><strong>Building:</strong> {{ $invoice->tenant->flat->building->name ?? 'Building not set' }}</p>
                <p><strong>Bedrooms:</strong> {{ $invoice->tenant->flat->bedrooms ?? 'N/A' }}</p>
                <p><strong>Bathrooms:</strong> {{ $invoice->tenant->flat->bathrooms ?? 'N/A' }}</p>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 10%;">SL</th>
                    <th style="width: 70%;">Description</th>
                    <th style="width: 20%; text-align: right;">Amount (৳)</th>
                </tr>
            </thead>
            <tbody>
                <?php $slNo = 1; ?>
                @if($invoice->house_rent)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('House Rent') }}</td>
                    <td>{{ number_format($invoice->house_rent, 2) }}</td>
                </tr>
                @endif
                @if($invoice->gas_bill)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('Gas Bill') }}</td>
                    <td>{{ number_format($invoice->gas_bill, 2) }}</td>
                </tr>
                @endif
                @if($invoice->water_bill)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('Water Bill') }}</td>
                    <td>{{ number_format($invoice->water_bill, 2) }}</td>
                </tr>
                @endif
                @if($invoice->service_charge)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('Service Charge') }}</td>
                    <td>{{ number_format($invoice->service_charge, 2) }}</td>
                </tr>
                @endif
                @if($invoice->electricity_bill)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('Electricity Bill (As per Meter)') }}</td>
                    <td>{{ number_format($invoice->electricity_bill, 2) }}</td>
                </tr>
                @endif
                @if($invoice->internet_bill)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('Internet Bill') }}</td>
                    <td>{{ number_format($invoice->internet_bill, 2) }}</td>
                </tr>
                @endif
                @if($invoice->garage_bill)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('Others (Garage Charge)') }}</td>
                    <td>{{ number_format($invoice->garage_bill, 2) }}</td>
                </tr>
                @endif
                @if($invoice->other_charges)
                <tr>
                    <td>{{ $slNo++ }}</td>
                    <td>{{ __('Others (Other Charges)') }}</td>
                    <td>{{ number_format($invoice->other_charges, 2) }}</td>
                </tr>
                @endif
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2">Total Amount</td>
                    <td>{{ number_format($invoice->total_amount, 2) }}</td>
                </tr>
            </tfoot>
        </table>

        <!-- Payment History -->
        <div class="payment-history">
            <h3>Payment History</h3>
            <table class="payment-table">
                <thead>
                    <tr>
                        <th style="width: 10%;">SL</th>
                        <th style="width: 25%;">Payment Date</th>
                        <th style="width: 30%;">Payment Method</th>
                        <th style="width: 25%;">Transaction No.</th>
                        <th style="width: 10%; text-align: right;">Amount (৳)</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($invoice->payments as $index => $payment)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ \Carbon\Carbon::parse($payment->payment_date)->format('d M Y') }}</td>
                        <td>{{ ucfirst($payment->payment_method) }}</td>
                        <td>{{ $payment->transaction_no ?? 'N/A' }}</td>
                        <td>{{ number_format($payment->amount, 2) }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 20px;">No payments recorded yet.</td>
                    </tr>
                    @endforelse
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4">Total Paid</td>
                        <td>{{ number_format($invoice->paid_amount, 2) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <p>Authorized Signature</p>
                <p style="margin-top: 5px;">{{ config('app.name', 'House Rent') }}</p>
            </div>
        </div>

        <!-- Print Actions -->
        <div class="print-actions">
            <button type="button" class="print-button" onclick="window.print()">🖨️ Print Receipt</button>
        </div>
    </div>
</body>
</html>

