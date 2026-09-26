<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('family_member_details', function (Blueprint $table) {
            $table->string('member_photo')->nullable()->after('member_name');
        });
    }

    public function down(): void
    {
        Schema::table('family_member_details', function (Blueprint $table) {
            $table->dropColumn('member_photo');
        });
    }
};