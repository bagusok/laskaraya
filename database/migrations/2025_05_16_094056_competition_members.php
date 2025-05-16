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
        Schema::create('competition_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_to_competition_id')->constrained('user_to_competitions')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'user_to_competition_id'], 'competition_member_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_members');
        Schema::table('competition_members', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['user_to_competition_id']);

            $table->dropUnique('competition_member_unique');
        });
    }
};
