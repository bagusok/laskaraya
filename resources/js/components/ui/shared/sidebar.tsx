import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePage } from "@inertiajs/react";
import { ChevronRight, LogOut, X } from "lucide-react";
import { SidebarProps, NavItem } from "../../../types/sidebar";
import { getPath, normalizePath } from "../../../lib/sidebar.utils";

export default function Sidebar({ navItems = [], sidebarOpen = false, onClose, currentUrl }: SidebarProps) {
    const { url } = usePage();
    const [isHovered, setIsHovered] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

    useEffect(() => {
        setSelectedItem(currentUrl);
        navItems.forEach((item, index) => {
            if (item.subItems?.some(subItem => currentUrl.startsWith(subItem.href))) {
                setOpenMenus(prev => ({ ...prev, [index]: true }));
            }
        });
    }, [currentUrl, navItems]);

    const isItemSelected = (href: string) => {
        if (!href) return false;

        let path = href;
        try {
            if (!href.startsWith('/') && !href.startsWith('http')) {
                path = getPath(route(href));
            } else {
                path = getPath(href);
            }
        } catch {
            path = getPath(href);
        }

        const normCurrent = normalizePath(currentUrl);
        const normPath = normalizePath(path);

        if (normPath === '/') {
            return normCurrent === '/';
        }
        return normCurrent === normPath || normCurrent.startsWith(normPath + '/');
    };

    const toggleSubmenu = (index: number) => {
        setOpenMenus(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <>
            <div
                className="hidden lg:block fixed inset-y-0 left-0 z-40 w-72 bg-white border-r"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Logo */}
                <div className="p-8 flex justify-center">
                    <img
                        src="/logol.svg"
                        alt="Logo"
                        className={`w-40 h-auto transition-all duration-500 ${isHovered ? "scale-105" : ""}`}
                    />
                </div>

                <div className="mx-6 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent mb-6" />

                <nav className="px-4 pb-4 overflow-y-auto h-[calc(100vh-12rem)]">
                    <ul className="space-y-2">
                        {navItems.map((item, index) => (
                            <li key={index} className="group">
                                {item.subItems ? (
                                    <>
                                        <div
                                            onClick={() => toggleSubmenu(index)}
                                            className="flex items-center justify-between p-3 rounded-xl text-gray-700 cursor-pointer
                                            hover:bg-gradient-to-r hover:from-purple-50 hover:to-white group-hover:shadow-sm transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl text-purple-500 group-hover:text-purple-600 transition-colors duration-300">{item.icon}</span>
                                                <span className="text-base font-medium">{item.label}</span>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className={`text-gray-400 transition-transform duration-300 ${openMenus[index] ? 'rotate-90' : ''}`}
                                            />
                                        </div>
                                        <ul className={`ml-10 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openMenus[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`flex items-center py-2 px-3 rounded-lg text-sm
                                                        hover:bg-purple-50 transition-all duration-200
                                                        ${isItemSelected(subItem.href)
                                                            ? "text-purple-700 font-medium bg-purple-50/80"
                                                            : "text-gray-600"}`}
                                                    >
                                                        <div className={`w-1 h-1 rounded-full mr-2 ${isItemSelected(subItem.href) ? "bg-purple-500" : "bg-gray-300"}`} />
                                                        <span>{subItem.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href || ''}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                                        ${isItemSelected(item.href || '')
                                            ? " text-purple-700 shadow-sm shadow-purple-300 border-none"
                                            : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white"}`}
                                    >
                                        <span className={`text-xl transition-colors duration-300 ${isItemSelected(item.href || '') ? "text-purple-600" : "text-purple-500 group-hover:text-purple-600"}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`text-base ${isItemSelected(item.href || '') ? "font-medium" : ""}`}>{item.label}</span>
                                        {isItemSelected(item.href || '') && (
                                            <div className="ml-auto w-1 h-6 bg-purple-500 rounded-full animate-pulse" />
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Logout Button */}
                    <div className="mt-12 relative">
                        <div className="absolute inset-x-0 -top-6 h-12 bg-gradient-to-b from-transparent to-white/80 pointer-events-none" />
                        <div className="mx-2 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent mb-6" />
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-5 shadow-sm transition-all duration-300 hover:shadow group"
                        >
                            <Link href={route("logout")} className="flex items-center justify-center gap-2">
                                <LogOut size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                <span>Logout</span>
                            </Link>
                        </Button>
                    </div>
                </nav>
            </div>

            {/* Mobile Sidebar */}
            <div className={`
                lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-md transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                {/* Mobile Close Button */}
                <div className="flex justify-end p-4">
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <X size={20} />
                    </button>
                </div>

                {/* Logo */}
                <div className="p-8 flex justify-center">
                    <img
                        src="/logol.svg"
                        alt="Logo"
                        className="w-40 h-auto"
                    />
                </div>

                <div className="mx-6 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent mb-6" />

                <nav className="px-4 pb-4 overflow-y-auto h-[calc(100vh-12rem)]">
                    <ul className="space-y-2">
                        {navItems.map((item, index) => (
                            <li key={index} className="group">
                                {item.subItems ? (
                                    <>
                                        <div
                                            onClick={() => toggleSubmenu(index)}
                                            className="flex items-center justify-between p-3 rounded-xl text-gray-700 cursor-pointer
                                            hover:bg-gradient-to-r hover:from-purple-50 hover:to-white group-hover:shadow-sm transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl text-purple-500 group-hover:text-purple-600 transition-colors duration-300">{item.icon}</span>
                                                <span className="text-base font-medium">{item.label}</span>
                                            </div>
                                            <ChevronRight
                                                size={18}
                                                className={`text-gray-400 transition-transform duration-300 ${openMenus[index] ? 'rotate-90' : ''}`}
                                            />
                                        </div>
                                        <ul className={`ml-10 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openMenus[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`flex items-center py-2 px-3 rounded-lg text-sm
                                                        hover:bg-purple-50 transition-all duration-200
                                                        ${isItemSelected(subItem.href)
                                                            ? "text-purple-700 font-medium bg-purple-50/80"
                                                            : "text-gray-600"}`}
                                                    >
                                                        <div className={`w-1 h-1 rounded-full mr-2 ${isItemSelected(subItem.href) ? "bg-purple-500" : "bg-gray-300"}`} />
                                                        <span>{subItem.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href || ''}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                                        ${isItemSelected(item.href || '')
                                            ? " text-purple-700 shadow-sm shadow-purple-300 border-none"
                                            : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white"}`}
                                    >
                                        <span className={`text-xl transition-colors duration-300 ${isItemSelected(item.href || '') ? "text-purple-600" : "text-purple-500 group-hover:text-purple-600"}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`text-base ${isItemSelected(item.href || '') ? "font-medium" : ""}`}>{item.label}</span>
                                        {isItemSelected(item.href || '') && (
                                            <div className="ml-auto w-1 h-6 bg-purple-500 rounded-full animate-pulse" />
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Logout Button */}
                    <div className="mt-12 relative">
                        <div className="absolute inset-x-0 -top-6 h-12 bg-gradient-to-b from-transparent to-white/80 pointer-events-none" />
                        <div className="mx-2 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent mb-6" />
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-5 shadow-sm transition-all duration-300 hover:shadow group"
                        >
                            <Link href={route("logout")} className="flex items-center justify-center gap-2">
                                <LogOut size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                <span>Logout</span>
                            </Link>
                        </Button>
                    </div>
                </nav>
            </div>
        </>
    );
}
