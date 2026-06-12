<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('report', function (Blueprint $table) {
            //
            $table->foreignId('signed_by_manajer')->nullable()->constrained('users');
            $table->string('signature_qr_manajer')->nullable()->unique(); // QR token
            $table->timestamp('signed_at_manajer')->nullable();
            $table->foreignId('signed_by_mitra')->nullable()->constrained('users');
            $table->string('signature_qr_mitra')->nullable()->unique(); // QR token
            $table->timestamp('signed_at_mitra')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('report', function (Blueprint $table) {
            //
        });
    }
};
