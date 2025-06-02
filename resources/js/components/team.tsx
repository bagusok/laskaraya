import { Github, Linkedin, Mail } from "lucide-react";
import teamMembers from "../lib/team.utils";
import { memo } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";
import "@/../css/scroll-reveal.css";

const TeamMember = memo(({ member }: { member: (typeof teamMembers)[0] }) => (
    <div className="team-card reveal-element group bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-between w-full max-w-none min-h-[480px] transition-all duration-300">
        <div className="w-full">
            <div className="team-image relative overflow-hidden bg-gray-100 rounded-2xl">
                <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[320px] md:h-[360px] object-cover rounded-2xl transition-all duration-700 ease-out"
                />
                {/* Social icons overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <div className="flex space-x-6">
                        <a
                            href={member.github}
                            className="social-icon w-14 h-14 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300 transform hover:scale-110 text-2xl"
                            title="Github"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-7 h-7" />
                        </a>
                        <a
                            href={member.linkedin}
                            className="social-icon w-14 h-14 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 text-2xl"
                            title="LinkedIn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin className="w-7 h-7" />
                        </a>
                        <a
                            href={member.email}
                            className="social-icon w-14 h-14 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 transition-all duration-300 transform hover:scale-110 text-2xl"
                            title="Email"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Mail className="w-7 h-7" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className="pt-8 pb-2 text-center">
            <h3 className="team-name text-2xl md:text-3xl font-extrabold text-black mb-2">
                {member.name}
            </h3>
            <p className="team-role text-lg md:text-xl font-bold text-black">
                {member.role}
            </p>
        </div>
    </div>
));

TeamMember.displayName = "TeamMember";

const TeamSection = memo(() => {
    useScrollReveal();
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 reveal-element">
                    <div className="inline-block mb-6">
                        <div className="w-16 h-px bg-gray-400 mx-auto mb-6"></div>
                        <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                            Our Team
                        </span>
                    </div>
                    <h2 className="swiss-title text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                        Tim Kami
                    </h2>
                    <p className="swiss-text text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Bertemu dengan tim pengembang yang berdedikasi di balik
                        Laskaraya. Setiap individu membawa keahlian unik yang
                        membentuk visi kami.
                    </p>
                </div>
                {/* Team Grid */}
                <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal-element">
                    {teamMembers.map((member, index) => (
                        <div
                            key={member.name}
                            className="transform transition-all duration-500"
                            style={{
                                transitionDelay: `${index * 100}ms`
                            }}
                        >
                            <TeamMember member={member} />
                        </div>
                    ))}
                </div>
                {/* Bottom section */}
                <div className="text-center mt-20 reveal-element">
                    <div className="w-16 h-px bg-gray-400 mx-auto mb-8"></div>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Bergabunglah dengan kami dalam membangun masa depan
                        teknologi yang lebih baik.
                    </p>
                </div>
            </div>
        </section>
    );
});

TeamSection.displayName = "TeamSection";

export default TeamSection;
