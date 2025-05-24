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
        Schema::create(('competitions'), function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('period_id')->constrained('periods')->onDelete('cascade');
            $table->string('name');
            $table->string('image');
            $table->string('author');
            $table->enum('level', ['1', '2', '3', '4', '5']);
            $table->enum('status', ['ongoing', 'completed', 'canceled']);
            $table->enum('verified_status', ['accepted', 'rejected', 'pending']);
            $table->text('description');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('notes')->nullable();
            $table->foreignId('uploader_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competitions');
    }
};
