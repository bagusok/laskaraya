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
        Schema::table('dosen_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('dosen_profiles', 'total_competitions')) {
                $table->integer('total_competitions')->default(0)->after('birth_date');
            }
            if (!Schema::hasColumn('dosen_profiles', 'total_wins')) {
                $table->integer('total_wins')->default(0)->after('total_competitions');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dosen_profiles', function (Blueprint $table) {
            $table->dropColumn(['total_competitions', 'total_wins']);
        });
    }
};