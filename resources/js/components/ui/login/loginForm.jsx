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
                    htmlFor="identifier"
                    className="block text-gray-700 mb-2 font-medium"
                >
                    <i className="fas fa-user mr-2"></i> NIM/NIP
                </label>
                <input
                    type="text"
                    id="identifier"
                    name="NIM/NIP"
                    value={data.identifier}
                    onChange={(e) => setData("identifier", e.target.value)}
                    className="w-full p-4 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="nim/nip"
                />
                {errors.identifier && (
                    <small className="text-sm text-red-500 italic">
                        * {errors.identifier}
                    </small>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-gray-700 mb-2 font-medium"
                >
                    <i className="fas fa-lock mr-2"></i> Password
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
