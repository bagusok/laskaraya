import { Award, Users, BookOpen } from "lucide-react";

export default function About() {
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
                    <div className="feature-card text-center reveal-element">
                        <div className="feature-icon">
                            <Award className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="swiss-title feature-title mb-3">
                            Pencatatan Prestasi
                        </h3>
                        <p className="swiss-text text-base text-gray-600">
                            Catat dan kelola semua prestasi akademik Anda dengan
                            mudah dan terstruktur
                        </p>
                    </div>
                    <div className="feature-card text-center reveal-element">
                        <div className="feature-icon">
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="swiss-title feature-title mb-3">
                            Kolaborasi
                        </h3>
                        <p className="swiss-text text-base text-gray-600">
                            Berkolaborasi dengan teman dan dosen untuk mencapai
                            prestasi bersama
                        </p>
                    </div>
                    <div className="feature-card text-center reveal-element">
                        <div className="feature-icon">
                            <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="swiss-title feature-title mb-3">
                            Pembelajaran
                        </h3>
                        <p className="swiss-text text-base text-gray-600">
                            Akses materi dan sumber belajar untuk meningkatkan
                            prestasi akademik
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
