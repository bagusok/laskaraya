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
        Schema::table('user_to_competitions', function (Blueprint $table) {
            $table->string('bimbingan_status')->default('bimbingan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_to_competitions', function (Blueprint $table) {
            $table->dropColumn('bimbingan_status');
        });
    }
};