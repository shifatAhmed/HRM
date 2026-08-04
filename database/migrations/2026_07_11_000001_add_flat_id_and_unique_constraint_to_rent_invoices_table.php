<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('rent_invoices', 'flat_id')) {
            Schema::table('rent_invoices', function (Blueprint $table) {
                $table->foreignId('flat_id')->nullable()->after('tenant_id')->constrained()->cascadeOnDelete();
            });
        }

        $existingRows = DB::table('rent_invoices')
            ->select('id', 'tenant_id')
            ->whereNull('flat_id')
            ->get();

        foreach ($existingRows as $row) {
            $tenant = DB::table('tenants')->where('id', $row->tenant_id)->first();
            if ($tenant) {
                DB::table('rent_invoices')
                    ->where('id', $row->id)
                    ->update(['flat_id' => $tenant->flat_id]);
            }
        }

        $duplicates = DB::table('rent_invoices')
            ->select('flat_id', 'year', 'month')
            ->whereNotNull('flat_id')
            ->groupBy('flat_id', 'year', 'month')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $duplicate) {
            $rows = DB::table('rent_invoices')
                ->where('flat_id', $duplicate->flat_id)
                ->where('year', $duplicate->year)
                ->where('month', $duplicate->month)
                ->orderBy('id')
                ->get();

            if ($rows->count() <= 1) {
                continue;
            }

            $idsToDelete = $rows->pluck('id')->slice(1)->all();
            if (! empty($idsToDelete)) {
                DB::table('rent_invoices')->whereIn('id', $idsToDelete)->delete();
            }
        }

        Schema::table('rent_invoices', function (Blueprint $table) {
            $table->foreignId('flat_id')->nullable(false)->change();
        });

        Schema::table('rent_invoices', function (Blueprint $table) {
            $table->unique(['flat_id', 'year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::table('rent_invoices', function (Blueprint $table) {
            $table->dropUnique(['flat_id', 'year', 'month']);
        });

        Schema::table('rent_invoices', function (Blueprint $table) {
            $table->dropForeign(['flat_id']);
            $table->dropColumn('flat_id');
        });
    }
};
