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
        Schema::table('achievements', function (Blueprint $table) {

            if (Schema::hasColumn('achievements', 'user_to_competitions_id')) {

                $table->dropForeign(['user_to_competitions_id']);
                $table->dropColumn('user_to_competitions_id');

                $table->foreignId('user_to_competition_id')
                    ->after('id')
                    ->constrained('user_to_competitions')
                    ->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            if (Schema::hasColumn('achievements', 'user_to_competition_id')) {
                $table->renameColumn('user_to_competition_id', 'user_to_competitions_id');
            }
        });
    }
};
