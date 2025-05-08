import React, { useState } from "react";
import { UserFormProps } from "@/types/userForm";
import { defaultValues, handleChangeForm, handleSubmitForm } from "@/lib/userForm.utils";
import { User } from "@/types/user";

export default function UserForm({ initialValues, onSubmit, onCancel, mode }: UserFormProps) {
  const [form, setForm] = useState<Partial<User>>({ ...defaultValues, ...initialValues });

  return (
    <div className="p-4 max-w-full sm:max-w-xl md:max-w-2xl mx-auto bg-white">
      <h2 className="text-xl font-normal text-purple-900 mb-4 tracking-tight">
        {mode === "add" ? "Tambah User" : "Edit User"}
      </h2>
      <form
        onSubmit={e => handleSubmitForm(e, form, onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
            >
              Nama
            </label>
            <input
              name="name"
              id="name"
              value={form.name}
              onChange={e => handleChangeForm(e, setForm)}
              className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
              required
            />
          </div>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
            >
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              value={form.email}
              onChange={e => handleChangeForm(e, setForm)}
              className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
              required
            />
          </div>
          {/* NIM/NIP Field */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
            >
              NIM/NIP
            </label>
            <input
              name="identifier"
              id="identifier"
              value={form.identifier}
              onChange={e => handleChangeForm(e, setForm)}
              className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
              required
            />
          </div>
          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
            >
              No. Telepon
            </label>
            <input
              name="phone"
              id="phone"
              value={form.phone}
              onChange={e => handleChangeForm(e, setForm)}
              className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
              required
            />
          </div>
          {/* Faculty Field */}
          <div>
            <label
              htmlFor="faculty"
              className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
            >
              Jurusan
            </label>
            <input
              name="faculty"
              id="faculty"
              value={form.faculty}
              onChange={e => handleChangeForm(e, setForm)}
              className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
              required
            />
          </div>
          {/* Role Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
            >
              Role
            </label>
            <div className="relative">
              <select
                name="role"
                id="role"
                value={form.role}
                onChange={e => handleChangeForm(e, setForm)}
                className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none bg-transparent appearance-none text-base text-purple-900 font-medium uppercase tracking-wide"
              >
                <option value="Mahasiswa" className="text-purple-700 bg-white font-medium">Mahasiswa</option>
                <option value="Dosen" className="text-purple-700 bg-white font-medium">Dosen</option>
                <option value="Admin" className="text-purple-700 bg-white font-medium">Admin</option>
              </select>
              <div className="absolute right-2 bottom-2 pointer-events-none">
                <svg className="h-4 w-4 text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* Password Field */}
          <div className="md:col-span-2">
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
            >
              Password
              {mode === "add" ? (
                <span className="normal-case text-purple-600 ml-1">(Wajib)</span>
              ) : (
                <span className="normal-case text-purple-600 ml-1">(Kosongkan jika tidak diubah)</span>
              )}
            </label>
            <input
              name="password"
              id="password"
              type="password"
              value={form.password || ""}
              onChange={e => handleChangeForm(e, setForm)}
              className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
              autoComplete="new-password"
              {...(mode === "add" ? { required: true } : {})}
            />
          </div>
        </div>
        {/* Form Actions */}
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full md:w-auto px-4 py-2 text-purple-700 hover:text-purple-900 transition-colors font-medium text-sm border border-purple-100 rounded-lg bg-white"
          >
            Batal
          </button>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-purple-800 text-white hover:bg-purple-900 transition-colors text-sm rounded-lg"
          >
            {mode === "add" ? "Tambah" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
