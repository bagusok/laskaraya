import { Button } from "@/components/ui/button";


export default function LoginForm({ formData, onChange, onSubmit }) {
    return (
        <div className="space-y-9">
            <div>
                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                    Nama
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    className="w-full p-4 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="Eleanor"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    className="w-full p-4 bg-blue-50/50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="Password"
                />
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
                onClick={onSubmit}
                className="w-full h-fit bg-purple-600 text-white py-4 rounded-lg transition-all duration-300 font-medium text-lg shadow-md hover:bg-purple-700 transform hover:-translate-y-0.5"
            >
                Login
            </Button>
        </div>
    );
}
