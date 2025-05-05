import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function LoginForm({
  data,
  setData,
  onSubmit,
  errors,
  processing,
}) {
  return (
    <div className="space-y-9">
      <form action="" onSubmit={onSubmit} className="space-y-2">
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 mb-2 font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className="w-full p-4 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            placeholder="mahasiswa@polinema.ac.id"
          />
          {errors.email && (
            <small className="text-sm text-red-500 italic">
              * {errors.email}
            </small>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 mb-2 font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            className="w-full p-4 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            placeholder="Password"
          />
          {errors.password && (
            <small className="text-sm text-red-500 italic">
              * {errors.password}
            </small>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mt-2">
            Lupa password?
            <span className="ml-1">
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-800 transition duration-200"
              >
                Hubungi Admin
              </a>
            </span>
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-fit bg-purple-600 text-white py-4 rounded-lg transition-all duration-300 font-medium text-lg shadow-md hover:bg-purple-700 transform hover:-translate-y-0.5 disabled:opacity-65"
          disabled={processing}
        >
          {processing ? "Loading..." : "Login"}
        </Button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Belum punya akun?
          <span className="ml-1">
            <Link
              href={route("register")}
              className="text-blue-600 hover:text-blue-800 transition duration-200"
            >
              Daftar
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
}
