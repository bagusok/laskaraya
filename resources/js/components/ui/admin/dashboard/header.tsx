import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
    user: {
        name?: string;
    };
    onToggleSidebar: () => void;
    title?: string;
}

export default function Header({
    user,
    onToggleSidebar,
    title = "Dashboard"
}: HeaderProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="mb-12 transition-all duration-300 px-4 sm:px-6 lg:px-12 pt-6">
            <div className="flex justify-between items-end flex-wrap sm:flex-nowrap gap-4">
                <div className="flex items-start gap-4 w-full sm:w-auto">
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="group w-full sm:w-auto">
                        <h1 className="text-3xl sm:text-5xl font-bold text-blue-900 mb-2 tracking-tight hover:tracking-wide transition-all duration-300">
                            {title}
                        </h1>
                        <p className="text-sm sm:text-lg font-medium text-gray-600 tracking-wide relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-0 before:h-[1px] before:bg-gray-400 group-hover:before:w-full before:transition-all before:duration-300">
                            Selamat datang kembali,{" "}
                            <span className="text-purple-600">
                                {user?.name || "Admin"}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="bg-white to-purple-50/30 px-6 py-3 rounded-lg hover:bg-white hover:shadow-sm shadow-purple-100 transition-all duration-300 border border-purple-100 w-full sm:w-auto">
                    <p className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                    </p>
                    <p className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors text-left mt-1">
                        {time.toLocaleTimeString("id-ID")}
                    </p>
                </div>
            </div>
        </header>
    );
}
