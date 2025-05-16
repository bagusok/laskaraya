import { Award, Users, BookOpen } from "lucide-react";
import { memo } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";
import "@/../css/scroll-reveal.css";

const features = [
    {
        icon: Award,
        title: "Pencatatan Prestasi",
        description:
            "Catat dan kelola semua prestasi akademik Anda dengan mudah dan terstruktur"
    },
    {
        icon: Users,
        title: "Kolaborasi",
        description:
            "Berkolaborasi dengan teman dan dosen untuk mencapai prestasi bersama"
    },
    {
        icon: BookOpen,
        title: "Pembelajaran",
        description:
            "Akses materi dan sumber belajar untuk meningkatkan prestasi akademik"
    }
] as const;

const FeatureCard = memo(
    ({
        icon: Icon,
        title,
        description
    }: {
        icon: typeof Award;
        title: string;
        description: string;
    }) => (
        <div className="feature-card text-center reveal-element">
            <div className="feature-icon">
                <Icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="swiss-title feature-title mb-3">{title}</h3>
            <p className="swiss-text text-base text-gray-600">{description}</p>
        </div>
    )
);

FeatureCard.displayName = "FeatureCard";

const AboutSection = memo(() => {
    useScrollReveal();
    return (
        <section className="py-20 bg-white relative overflow-hidden" id="about">
            {/* Dekorasi */}
            <div className="section-deco deco-dot" />
            <div className="section-deco deco-line" />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 reveal-element">
                    <h2 className="swiss-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Tentang Laskaraya
                    </h2>
                    <p className="swiss-text text-lg text-gray-600 max-w-2xl mx-auto">
                        Platform pencatatan prestasi mahasiswa yang memudahkan
                        dalam mengelola dan melacak pencapaian akademik
                    </p>
                </div>
                <div className="feature-grid">
                    {features.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
