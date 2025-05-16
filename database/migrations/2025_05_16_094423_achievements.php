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
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_to_competitions_id')->constrained('user_to_competitions')->onDelete('cascade');
            $table->foreignId('competition_id')->constrained('competitions')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('champion', ['1', '2', '3', '4', '5']);
            $table->decimal('score', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropForeign(['user_to_competitions_id']);
            $table->dropForeign(['competition_id']);
        });
    }
};
