import { Github, Linkedin, Mail } from "lucide-react";
import teamMembers from "../lib/team.utils";
import { memo } from "react";

const TeamMember = memo(({ member }: { member: (typeof teamMembers)[0] }) => (
    <div className="team-card reveal-element">
        <div className="team-image">
            <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                decoding="async"
            />
        </div>
        <div className="team-info">
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <div className="team-social">
                <a
                    href={member.github}
                    className="social-icon"
                    title="Github"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github className="w-5 h-5" />
                </a>
                <a
                    href={member.linkedin}
                    className="social-icon"
                    title="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
                <a
                    href={member.email}
                    className="social-icon"
                    title="Email"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Mail className="w-5 h-5" />
                </a>
            </div>
        </div>
    </div>
));

TeamMember.displayName = "TeamMember";

const TeamSection = memo(() => {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Dekorasi */}
            <div
                className="section-deco deco-dot"
                style={{ top: "18%", left: "85%" }}
            />
            <div
                className="section-deco deco-line"
                style={{ bottom: "8%", left: "5%" }}
            />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 reveal-element">
                    <h2 className="swiss-title text-4xl font-bold text-gray-900 mb-4">
                        Tim Kami
                    </h2>
                    <p className="swiss-text text-lg text-gray-600 max-w-2xl mx-auto">
                        Bertemu dengan tim pengembang yang berdedikasi di balik
                        Laskaraya
                    </p>
                </div>
                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <TeamMember key={member.name} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
});

TeamSection.displayName = "TeamSection";

export default TeamSection;
