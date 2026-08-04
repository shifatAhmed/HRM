<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained()->cascadeOnDelete();
            $table->string('flat_no');
            $table->string('floor')->nullable();
            $table->string('size')->nullable();
            $table->decimal('rent', 12, 2)->default(0);
            $table->decimal('gas_bill', 12, 2)->default(0);
            $table->decimal('water_bill', 12, 2)->default(0);
            $table->decimal('service_charge', 12, 2)->default(0);
            $table->string('electric_meter')->nullable();
            $table->enum('status', ['occupied', 'vacant'])->default('vacant');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flats');
    }
};
