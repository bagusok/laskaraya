import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import useAuth from "@/hooks/use-auth";

export default function Welcome() {
    const [isHovered, setIsHovered] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Head title="Welcome" />
            <main className="min-h-dvh bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto px-8 relative z-10">
                    <div className="flex flex-col justify-center gap-4 pt-20 lg:pt-0">
                        <div
                            className={`transform transition-all duration-700 hover:scale-105`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <img
                                src="/logol.svg"
                                alt="Laskaraya Logo"
                                className="w-[450px] h-auto drop-shadow-lg drop-shadow-blue-200"
                            />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">
                                Pencatatan
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 ml-3">
                                    Prestasi
                                </span>
                            </h1>
                            <h2 className="text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                                Mahasiswa
                            </h2>
                            <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            {isAuthenticated ? (
                                <Link href={route("dashboard")}>
                                    <Button
                                        className="cursor-default group h-14 w-44 rounded-full px-10 text-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-500 flex items-center gap-3 shadow-lg hover:shadow-xl"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        Dashboard
                                        <ChevronRight className="transform transition-transform duration-500 group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            ) : null}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-center relative py-12">
                        <div
                            className="absolute w-72 h-72 rounded-full bg-blue-100/80 backdrop-blur-sm transition-all duration-700"
                            style={{
                                top: `20%`,
                                right: `30%`,
                                transform: `translate(${scrollY * 0.02}px, -${scrollY * 0.05}px)`
                            }}
                        ></div>

                        <div
                            className="absolute w-48 h-48 rounded-full bg-purple-100/80 backdrop-blur-sm transition-all duration-700"
                            style={{
                                bottom: `35%`,
                                left: `30%`,
                                transform: `translate(${scrollY * 0.04}px, ${scrollY * 0.03}px)`
                            }}
                        ></div>

                        <div
                            className={`relative z-10 w-full max-w-md transition-all duration-1000 hover:scale-105 ${
                                isHovered ? "transform -translate-y-2" : ""
                            }`}
                        >
                            <img
                                src="/piala.svg"
                                alt="Trophy Illustration"
                                className="w-[800px] h-auto drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Login Button */}
                {!isAuthenticated && (
                    <div className="absolute top-10 right-8 z-20">
                        <Link href={route("login")}>
                            <Button
                                className="cursor-default group h-14 w-36 rounded-sm px-10 text-xl font-medium bg-blue-500 text-white hover:bg-blue-600  transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                Login
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Contact link */}
                <div className="absolute top-8 left-8 backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full">
                    <div className="text-sm text-gray-800 flex items-center gap-2">
                        <i className="fas fa-headset"></i>
                        <span>Need help?</span>
                        <a
                            href="mailto:support@example.com"
                            className="text-blue-600 hover:text-purple-600 transition-colors duration-300"
                        >
                            contact us
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}
