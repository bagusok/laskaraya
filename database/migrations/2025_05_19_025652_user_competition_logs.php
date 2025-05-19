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
        Schema::create('user_competition_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_to_competition_id')->constrained('user_to_competitions')->onDelete('cascade');
            $table->string('name');
            $table->text('description');
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_competition_logs');
    }
};
