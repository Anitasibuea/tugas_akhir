<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remove AUTO_INCREMENT from id
        DB::statement("
            ALTER TABLE report
            MODIFY id VARCHAR(20) NOT NULL
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE report
            MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT
        ");
    }
};

