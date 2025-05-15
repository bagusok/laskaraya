import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Laskaraya</h3>
                        <p className="text-gray-400">
                            Platform pencatatan prestasi mahasiswa yang
                            memudahkan dalam mengelola dan melacak pencapaian
                            akademik
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Tautan Cepat
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Beranda
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Tentang
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Fitur
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Kontak
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400">
                                Email: info@laskaraya.com
                            </li>
                            <li className="text-gray-400">
                                Phone: +62 123 4567 890
                            </li>
                            <li className="text-gray-400">
                                Alamat: Jl. Contoh No. 123
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Ikuti Kami
                        </h4>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} Laskaraya. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
