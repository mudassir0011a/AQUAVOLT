import React from 'react';

const TeamMemberCard: React.FC<{ name: string; role: string; icon: string }> = ({ name, role, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-4xl mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{name}</h3>
        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{role}</p>
    </div>
);


const AboutUsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">About AquaVolt</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
                        Empowering citizens and enhancing civic infrastructure through technology.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md transition-colors duration-300">
                    <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-center">
                        AquaVolt was born from a simple idea: to bridge the communication gap between citizens and civic authorities. We aim to provide a single, streamlined platform for reporting and resolving essential utility issues—specifically water and electricity—in Navi Mumbai. By making the reporting process transparent, easy, and efficient, we empower every resident to become an active participant in improving our community's infrastructure.
                    </p>
                </div>
                
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <TeamMemberCard name="Mohammed Shaikh" role="Researcher" icon="🔬" />
                        <TeamMemberCard name="Ansari Huzaifa" role="Frontend" icon="💻" />
                        <TeamMemberCard name="Shaikh Mudassir" role="Backend" icon="🗄️" />
                        <TeamMemberCard name="Sufyan Ustad" role="ML Guy" icon="🧠" />
                    </div>
                </div>

                 <div className="text-center text-slate-500 dark:text-slate-400">
                    <p>
                        Together, we are committed to leveraging technology to build a more responsive and accountable civic ecosystem.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;