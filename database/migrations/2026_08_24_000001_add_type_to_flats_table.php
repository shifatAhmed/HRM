<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('flats', 'type')) {
            Schema::table('flats', function (Blueprint $table) {
                $table->unsignedTinyInteger('type')
                    ->default(1)
                    ->comment('1 = flat, 2 = single room')
                    ->after('flat_no');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('flats', 'type')) {
            Schema::table('flats', function (Blueprint $table) {
                $table->dropColumn('type');
            });
        }
    }
};