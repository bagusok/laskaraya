import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import LoginForm from "@/components/ui/login/loginForm";

export default function LoginPage() {
    const [formData, setFormData] = useState({ name: "", password: "" });
    const [alert, setAlert] = useState({
        visible: false,
        type: "default", // or 'destructive'
        title: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = () => {
        const validUser = { name: "admin", password: "admin123" };

        if (
            formData.name === validUser.name &&
            formData.password === validUser.password
        ) {
            setAlert({
                visible: true,
                type: "default",
                title: "Berhasil",
                message: "Login berhasil! Mengarahkan...",
            });
        } else {
            setAlert({
                visible: true,
                type: "destructive",
                title: "Gagal",
                message: "Username atau password salah.",
            });
        }

        setTimeout(() => {
            setAlert((prev) => ({ ...prev, visible: false }));
        }, 3000);
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-6 left-6">
                    <img
                        src="/logol.svg"
                        alt="Laskaraya Logo"
                        className="w-40 h-auto"
                    />
                </div>

                {alert.visible && (
                    <div className="fixed top-10 right-4 z-50 animate-fade-in w-96 h-fit">
                        <Alert
                            variant={alert.type}
                            className={`${alert.type === "default" ? "border-2 border-green-500" : "border-2 border-red-500"} relative p-4 rounded-lg shadow-lg`}
                        >
                            <button
                                onClick={() =>
                                    setAlert((prev) => ({
                                        ...prev,
                                        visible: false,
                                    }))
                                }
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-purple-300 overflow-hidden border-2 border-purple-700 z-10 hover:shadow-lg duration-500 transform hover:-translate-y-0.5 duration-500">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-10">
                            <h2 className="text-[35px] font-bold text-transparent bg-clip-text bg-gray-700 mb-10 text-center">
                                Selamat <span>Datang</span>
                            </h2>
                            <LoginForm
                                formData={formData}
                                onChange={handleChange}
                                onSubmit={handleLogin}
                            />
                        </div>
                        <div className="hidden md:block md:w-1/2 relative overflow-hidden p-4 rounded-2xl">
                            <img
                                src="menang.jpg"
                                alt="Trophy Display"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
