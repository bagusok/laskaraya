<?php

namespace App\Http\Controllers;

use App\Models\CategoryModel as Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('created_at', 'desc')->get();
        return Inertia::render('dashboard/admin/categories/index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Category::create($request->only('name'));
        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $category = Category::findOrFail($id);
        $category->update($request->only('name'));
        return redirect()->back()->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return redirect()->back()->with('success', 'Kategori berhasil dihapus');
    }

    // CRUD untuk dosen
    public function indexDosen()
    {
        $categories = Category::orderBy('created_at', 'desc')->get();
        return Inertia::render('dashboard/dosen/categories/index', [
            'categories' => $categories
        ]);
    }

    public function storeDosen(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Category::create($request->only('name'));
        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan');
    }

    public function updateDosen(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $category = Category::findOrFail($id);
        $category->update($request->only('name'));
        return redirect()->back()->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroyDosen($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return redirect()->back()->with('success', 'Kategori berhasil dihapus');
    }

    //CRUD untuk mahasiswa
    public function indexMahasiswa()
    {
        $categories = Category::orderBy('created_at', 'desc')->get();
        return Inertia::render('dashboard/mahasiswa/categories/index', [
            'categories' => $categories
        ]);
    }

    public function storeMahasiswa(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Category::create($request->only('name'));
        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan');
    }

    public function updateMahasiswa(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $category = Category::findOrFail($id);
        $category->update($request->only('name'));
        return redirect()->back()->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroyMahasiswa($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return redirect()->back()->with('success', 'Kategori berhasil dihapus');
    }
}
