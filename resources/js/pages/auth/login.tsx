import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Head, useForm, router } from "@inertiajs/react";
import toast from "react-hot-toast";
import LoginForm from "@/components/ui/login/loginForm";
import Carousel from "@/components/ui/carousel";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "@/components/loadingScreen";
import { useState } from "react";
import "@/../css/login-custom.css";

export default function Login() {
    const { data, setData, processing, post, errors } = useForm({
        email: "",
        password: ""
    });

    const [showLoading, setShowLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowLoading(true);
        post(route("login.post"), {
            onSuccess: (data) => {
                setShowLoading(false);
                toast.success(data.props?.success);
            },
            onError: (error) => {
                setShowLoading(false);
                toast.error("Email atau password salah!");
            }
        });
    };

    if (showLoading && processing) return <LoadingScreen />;

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen p-6 md:p-0 bg-gradient-to-br from-white to-blue-50 flex items-center justify-center relative overflow-hidden">
                <button
                    onClick={() => router.visit("/")}
                    className="absolute top-6 left-2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-purple-100 border border-purple-200 text-purple-700 font-semibold shadow-sm transition-all login-btn-glow"
                >
                    <ArrowLeft size={18} />
                    Kembali
                </button>
                <div className="absolute top-6 right-6">
                    <img
                        src="/logol.svg"
                        alt="Laskaraya Logo"
                        className="w-40 h-auto login-logo-animate"
                    />
                </div>

                {/* {alert.visible && (
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
        )} */}

                <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-purple-300 overflow-hidden border-2 border-purple-700 z-10 hover:shadow-lg transform hover:-translate-y-0.5 duration-500 login-fade-in login-glow">
                    <div className="flex flex-col md:flex-row p-4">
                        <div className="w-full md:w-1/2 p-10">
                            <h2 className="text-[35px] font-bold text-transparent bg-clip-text bg-gray-700 mb-10 text-center">
                                Selamat <span>Datang</span>
                            </h2>
                            <LoginForm
                                data={data}
                                setData={setData}
                                processing={processing}
                                onSubmit={handleSubmit}
                                errors={errors}
                            />
                        </div>
                        <div className="hidden md:block md:w-1/2 relative overflow-hidden p-4 rounded-2xl">
                            <Carousel />
                        </div>
                    </div>
                </div>
            </div>

            {/* <style jsx>{`
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
      `}</style> */}
        </>
    );
}
