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
            if (Schema::hasColumn('achievements', 'competition_id')) {
                $table->dropForeign(['competition_id']);
                $table->dropColumn('competition_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            if (!Schema::hasColumn('achievements', 'competition_id')) {
                $table->unsignedBigInteger('competition_id')->nullable()->after('user_to_competition_id');
                $table->foreign('competition_id')->references('id')->on('competitions')->onDelete('cascade');
            }
        });
    }
};
