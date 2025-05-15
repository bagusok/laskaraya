import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import About from "@/components/about";
import Team from "@/components/team";
import Footer from "@/components/footer";
import "../../css/index.css";
import LoadingScreen from "@/components/loadingScreen";

export default function Welcome() {
    const [scrollY, setScrollY] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { isAuthenticated } = useAuth();
    const heroRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi loading, bisa diganti dengan event onReady/data fetch
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading) {
            const revealElements = () => {
                const elements = document.querySelectorAll(".reveal-item");
                elements.forEach((element) => {
                    const elementTop = (
                        element as HTMLElement
                    ).getBoundingClientRect().top;
                    const elementVisible = 150;
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.classList.add("is-revealed");
                    }
                });
            };

            const handleScroll = () => {
                setScrollY(window.scrollY);
                revealElements();
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (heroRef.current) {
                    const rect = heroRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setMousePosition({ x, y });
                }
            };

            // Reveal on mount
            revealElements();
            window.addEventListener("scroll", handleScroll, { passive: true });
            window.addEventListener("mousemove", handleMouseMove);

            return () => {
                window.removeEventListener("scroll", handleScroll);
                window.removeEventListener("mousemove", handleMouseMove);
            };
        }
    }, [loading]);

    // Calculate parallax effects
    const calculateParallax = (factor: number) => {
        return {
            transform: `translate(${mousePosition.x * factor}px, ${mousePosition.y * factor}px)`
        };
    };

    if (loading) return <LoadingScreen />;

    return (
        <>
            <Head title="Welcome" />
            <div className="cursor-dot"></div>
            <div className="cursor-outline"></div>

            <main className="min-h-dvh bg-white relative overflow-hidden">
                {/* Navigation */}
                <nav className="creative-nav">
                    <div className="nav-logo">
                        <img
                            src="/logol.svg"
                            alt="Laskaraya Logo"
                            className="nav-logo-img"
                        />
                    </div>

                    <div className="nav-right">
                        <div className="help-link">
                            <div className="text-sm flex items-center gap-2">
                                <span className="help-text">Need help?</span>
                                <a
                                    href="mailto:support@example.com"
                                    className="contact-link"
                                >
                                    contact us
                                </a>
                            </div>
                        </div>

                        {!isAuthenticated && (
                            <Link href={route("login")}>
                                <Button className="login-button">
                                    Login
                                    <div className="login-button-bg"></div>
                                </Button>
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="creative-hero" ref={heroRef}>
                    <div className="grid-layout">
                        {/* Left Content */}
                        <div className="hero-content reveal-item">
                            <div className="split-text-container">
                                <h1 className="creative-title">
                                    <span className="creative-title-line">
                                        Pencatatan
                                    </span>
                                    <span className="creative-title-line accent-line">
                                        <span className="title-accent">
                                            Prestasi
                                        </span>
                                    </span>
                                    <span className="creative-title-line">
                                        Mahasiswa
                                    </span>
                                </h1>
                            </div>

                            <p
                                className="hero-description reveal-item"
                                style={{ transitionDelay: "100ms" }}
                            >
                                Platform modern untuk pendataan dan visualisasi
                                prestasi mahasiswa.
                            </p>

                            <div
                                className="action-buttons reveal-item"
                                style={{ transitionDelay: "200ms" }}
                            >
                                {isAuthenticated ? (
                                    <Link href={route("dashboard")}>
                                        <Button className="primary-action-btn group">
                                            <span>Dashboard</span>
                                            <ArrowUpRight className="action-icon" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={route("login")}>
                                        <Button className="primary-action-btn group">
                                            <span>Login</span>
                                            <ArrowUpRight className="action-icon" />
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <div
                                className="stats-container reveal-item"
                                style={{ transitionDelay: "300ms" }}
                            >
                                <div className="stat-item">
                                    <div className="stat-number">500+</div>
                                    <div className="stat-label">Prestasi</div>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <div className="stat-number">10k+</div>
                                    <div className="stat-label">Mahasiswa</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Trophy */}
                        <div className="visual-content">
                            <div className="trophy-animation-container">
                                <div
                                    className="trophy-wrapper"
                                    style={{
                                        transform: `translateY(${scrollY * -0.05}px) rotate(${scrollY * 0.02}deg)`
                                    }}
                                >
                                    <img
                                        src="/piala.svg"
                                        alt="Trophy Illustration"
                                        className="trophy-image"
                                    />
                                </div>
                            </div>

                            {/* Creative geometric elements */}
                            <div className="geo-decorations">
                                <div
                                    className="geo-element geo-square"
                                    style={calculateParallax(-0.02)}
                                ></div>
                                <div
                                    className="geo-element geo-circle"
                                    style={calculateParallax(-0.01)}
                                ></div>
                                <div
                                    className="geo-element geo-triangle"
                                    style={calculateParallax(-0.03)}
                                ></div>
                                <div
                                    className="geo-element geo-rect"
                                    style={calculateParallax(-0.015)}
                                ></div>
                            </div>

                            <div className="interactive-grid">
                                {Array.from({ length: 36 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="grid-dot"
                                        style={{
                                            animationDelay: `${index * 0.05}s`
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated divider */}
                <div className="section-divider">
                    <div className="divider-line"></div>
                    <div className="divider-text">Scroll to explore</div>
                    <div className="divider-line"></div>
                </div>
            </main>
            <About />
            <Team />
            <Footer />
        </>
    );
}
