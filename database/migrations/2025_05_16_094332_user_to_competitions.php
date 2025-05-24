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
        Schema::create('user_to_competitions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('registrant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('dosen_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('competition_id')->constrained('competitions')->onDelete('cascade');
            $table->enum('status', ['accepted', 'rejected', 'pending']);
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->unique(['registrant_id', 'competition_id'], 'user_competition_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_to_competitions');
        Schema::table('user_to_competitions', function (Blueprint $table) {
            $table->dropForeign(['registrant_id']);
            $table->dropForeign(['dosen_id']);
            $table->dropForeign(['competition_id']);

            $table->dropUnique('user_competition_unique');
        });
    }
};
