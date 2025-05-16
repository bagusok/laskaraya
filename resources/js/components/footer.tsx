import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const quickLinks = [
    { href: "#", label: "Beranda" },
    { href: "#", label: "Tentang" },
    { href: "#", label: "Fitur" },
    { href: "#", label: "Kontak" }
];

const contactInfo = [
    { label: "Email", value: "info@laskaraya.com" },
    { label: "Phone", value: "+62 123 4567 890" },
    { label: "Alamat", value: "Jl. Contoh No. 123" }
];

const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Mail, href: "#" }
];

const FooterLink = ({
    href,
    children
}: {
    href: string;
    children: React.ReactNode;
}) => (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
);

const FooterSection = ({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div>
        <h4 className="text-lg font-semibold mb-4">{title}</h4>
        {children}
    </div>
);

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <FooterSection title="Laskaraya">
                        <div className="space-y-4">
                            <p className="text-gray-400">
                                Platform pencatatan prestasi mahasiswa yang
                                memudahkan dalam mengelola dan melacak
                                pencapaian akademik
                            </p>
                        </div>
                    </FooterSection>

                    <FooterSection title="Tautan Cepat">
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <FooterLink href={link.href}>
                                        {link.label}
                                    </FooterLink>
                                </li>
                            ))}
                        </ul>
                    </FooterSection>

                    <FooterSection title="Kontak">
                        <ul className="space-y-2">
                            {contactInfo.map((info) => (
                                <li key={info.label} className="text-gray-400">
                                    {info.label}: {info.value}
                                </li>
                            ))}
                        </ul>
                    </FooterSection>

                    <FooterSection title="Ikuti Kami">
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <FooterLink key={index} href={social.href}>
                                    <social.icon className="w-5 h-5" />
                                </FooterLink>
                            ))}
                        </div>
                    </FooterSection>
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
