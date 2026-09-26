<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('plan')->default('trial');
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('account_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });

        $accountId = DB::table('accounts')->insertGetId([
            'name' => 'Default Account',
            'slug' => 'default-account',
            'plan' => 'trial',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->whereNull('account_id')->update(['account_id' => $accountId]);

        foreach (['buildings', 'flats', 'tenants', 'family_member_details', 'rent_invoices', 'payments'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('account_id')->nullable()->after('id')->constrained()->nullOnDelete();
            });

            DB::table($tableName)->whereNull('account_id')->update(['account_id' => $accountId]);
        }
    }

    public function down(): void
    {
        foreach (['payments', 'rent_invoices', 'family_member_details', 'tenants', 'flats', 'buildings'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['account_id']);
                $table->dropColumn('account_id');
            });
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
            $table->dropColumn('account_id');
        });

        Schema::dropIfExists('accounts');
    }
};
