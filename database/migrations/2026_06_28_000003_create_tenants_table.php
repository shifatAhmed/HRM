<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flat_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('nid')->nullable();
            $table->string('profession')->nullable();
            $table->integer('family_members')->nullable();
            $table->decimal('advance_amount', 12, 2)->default(0);
            $table->decimal('monthly_rent', 12, 2)->default(0);
            $table->date('move_in_date')->nullable();
            $table->date('move_out_date')->nullable();
            $table->enum('status', ['active', 'moved_out'])->default('active');
            $table->string('emergency_contact')->nullable();
            $table->string('photo')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
