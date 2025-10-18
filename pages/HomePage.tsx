import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import { useTheme } from '../context/ThemeContext';

const statCardColorClasses: { [key: string]: string } = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    green: 'text-green-600 dark:text-green-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    teal: 'text-teal-600 dark:text-teal-400',
};

const StatCard: React.FC<{ title: string; value: string; subtitle: string; color: keyof typeof statCardColorClasses }> = ({ title, value, subtitle, color }) => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center transition-colors duration-300">
        <p className={`text-sm font-bold uppercase tracking-wider ${statCardColorClasses[color]} mb-2`}>{title}</p>
        <p className={`text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2`}>{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
);

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md hover:shadow-xl dark:hover:shadow-emerald-900/20 transition-all duration-300 border border-slate-200 dark:border-slate-700">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
);

const GovPartnerCard: React.FC<{
  icon: string;
  name: string;
  fullName: string;
  responsibility: string;
  website: string;
  colorClass: string;
}> = ({ icon, name, fullName, responsibility, website, colorClass }) => (
  <div className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-l-4 ${colorClass}`}>
    <div className="flex items-start gap-4">
      <div className="text-3xl flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{fullName}</p>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{responsibility}</p>
        <a href={website} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
          Visit Website →
        </a>
      </div>
    </div>
  </div>
);


const BenefitPoint: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-2xl">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        </div>
    </div>
);

const CityNetworkIllustration: React.FC = () => (
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="stop-color-sky-light dark:stop-color-sky-dark" />
                <stop offset="100%" className="stop-color-bg-light dark:stop-color-bg-dark" />
            </linearGradient>
            <style>
                {`
                .stop-color-sky-light { stop-color: #e0f2f1; }
                .dark .stop-color-sky-light { stop-color: #2dd4bf; }
                .stop-color-sky-dark { stop-color: #1e3a8a; }
                
                .stop-color-bg-light { stop-color: #f8fafc; }
                .dark .stop-color-bg-light { stop-color: #f8fafc; }
                .dark .stop-color-bg-dark { stop-color: #1e293b; }

                .building-light { fill: #cbd5e1; }
                .dark .building-light { fill: #475569; }
                .building-dark { fill: #94a3b8; }
                .dark .building-dark { fill: #334155; }
                .line-color { stroke: #10b981; stroke-opacity: 0.6; }
                .dot-color { fill: #10b981; }
                `}
            </style>
        </defs>
        <rect width="200" height="120" fill="url(#skyGradient)" />
        <path d="M0 120 Q 50 90, 100 100 T 200 80 V 120 Z" className="fill-slate-200 dark:fill-slate-700" />
        
        {/* Buildings */}
        <rect x="20" y="60" width="15" height="60" className="building-dark" rx="1"/>
        <rect x="40" y="50" width="20" height="70" className="building-light" rx="1"/>
        <rect x="65" y="70" width="18" height="50" className="building-dark" rx="1"/>
        <rect x="90" y="40" width="25" height="80" className="building-light" rx="1"/>
        <rect x="120" y="65" width="15" height="55" className="building-dark" rx="1"/>
        <rect x="140" y="55" width="20" height="65" className="building-light" rx="1"/>
        <rect x="165" y="75" width="15" height="45" className="building-dark" rx="1"/>

        {/* Network lines and dots */}
        <g strokeWidth="0.8" className="line-color">
            <path d="M25 65 Q 60 40, 95 45" fill="none" />
            <path d="M45 55 Q 80 80, 125 70" fill="none" />
            <path d="M70 75 Q 110 50, 145 60" fill="none" />
            <path d="M100 45 Q 130 90, 170 80" fill="none" />
        </g>
        <circle cx="25" cy="65" r="1.5" className="dot-color" />
        <circle cx="95" cy="45" r="1.5" className="dot-color" />
        <circle cx="45" cy="55" r="1.5" className="dot-color" />
        <circle cx="125" cy="70" r="1.5" className="dot-color" />
        <circle cx="70" cy="75" r="1.5" className="dot-color" />
        <circle cx="145" cy="60" r="1.5" className="dot-color" />
        <circle cx="170" cy="80" r="1.5" className="dot-color" />
    </svg>
);

const FaqItem: React.FC<{ question: string; children: React.ReactNode; initialOpen?: boolean }> = ({ question, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-slate-800 dark:text-slate-200"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <div className="pt-4 text-slate-600 dark:text-slate-400">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  const { theme } = useTheme();

  const heroImage = 'https://thumbs.dreamstime.com/b/sunset-over-city-skyline-power-lines-reflecting-calm-river-casts-warm-hues-across-tall-buildings-lining-338469053.jpg';

  const overlayGradient = theme === 'light' 
    ? 'bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent' 
    : 'bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent';
  
  const heroTextColor = theme === 'light' ? 'text-slate-800' : 'text-white';

  const heroTextShadow = theme === 'light' 
    ? { textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }
    : { textShadow: '2px 2px 8px rgba(0,0,0,0.7)' };

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-center bg-cover bg-center transition-all duration-300"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={`absolute top-0 left-0 w-full h-full ${overlayGradient} z-10`}></div>
        <div className={`relative z-20 container mx-auto px-4 ${heroTextColor}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={heroTextShadow}>Report. Track. Resolve.</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={heroTextShadow}>A unified platform for water and electricity issue reporting in Navi Mumbai.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/report" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-emerald-900 font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg w-full sm:w-auto">
              Report an Issue
            </Link>
            <Link to="/track" className="bg-white/90 dark:bg-white/10 backdrop-blur-sm dark:hover:bg-white/20 text-emerald-600 dark:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg w-full sm:w-auto">
              Track a Complaint
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-30 -mt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title="TOTAL REPORTS" value="1,247" subtitle="Total Infrastructure Reports" color="emerald" />
            <StatCard title="RESOLVED TODAY" value="89" subtitle="Issues Fixed Today" color="green" />
            <StatCard title="WATER ISSUES" value="500" subtitle="Reports Managed by CIDCO" color="cyan" />
            <StatCard title="ELECTRICITY ISSUES" value="747" subtitle="Reports Managed by MSEDCL" color="teal" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">Simple, fast, and effective way to report and track infrastructure issues.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon="💧" title="Water Issues" description="Report leaks, low pressure, or supply problems managed by CIDCO." />
            <FeatureCard icon="⚡" title="Electricity Issues" description="Report power cuts, voltage issues, or streetlight problems managed by MSEDCL." />
            <FeatureCard icon="📊" title="Live Tracking" description="Get real-time updates on your complaint status from acknowledgement to resolution." />
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose AquaVolt?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-2">
              Empowering citizens with a direct line to civic authorities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="px-8">
              <CityNetworkIllustration />
            </div>
            <div className="space-y-8">
              <BenefitPoint icon="🔗" title="Unified Platform" description="One single app for reporting both water and electricity issues. No more confusion." />
              <BenefitPoint icon="🗣️" title="Direct Communication" description="Your reports go directly to the concerned departments at CIDCO and MSEDCL." />
              <BenefitPoint icon="📈" title="Transparent Tracking" description="Monitor the progress of your complaint in real-time with our easy-to-use tracking system." />
              <BenefitPoint icon="🤝" title="Community Powered" description="Join your neighbors in creating a more accountable and responsive civic infrastructure." />
            </div>
          </div>
        </div>
      </section>

      {/* Civic Partners Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Civic Partners</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-2">
              Working hand-in-hand with government bodies to ensure swift action on your reports.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <GovPartnerCard
              icon="💧"
              name="CIDCO"
              fullName="City and Industrial Development Corporation"
              responsibility="Manages urban planning and water supply infrastructure across Navi Mumbai."
              website="https://cidco.maharashtra.gov.in/"
              colorClass="border-cyan-500"
            />
            <GovPartnerCard
              icon="⚡"
              name="MSEDCL"
              fullName="Maharashtra State Electricity Distribution Co. Ltd."
              responsibility="Responsible for electricity distribution and maintenance for the entire state, including Navi Mumbai."
              website="https://www.mahadiscom.in/"
              colorClass="border-yellow-500"
            />
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-2">
                      Quick answers to some of our most common questions.
                  </p>
              </div>
              <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
                  <FaqItem question="What is AquaVolt?" initialOpen={true}>
                      <p>AquaVolt is a streamlined, unified platform for citizens of Navi Mumbai to report and track civic issues related to water and electricity supply. Our goal is to make communication with civic bodies like CIDCO and MSEDCL faster and more transparent.</p>
                  </FaqItem>
                  <FaqItem question="How do I report an issue?">
                      <p>Simply click on the "Report Issue" link in the navigation bar. You'll be asked to choose the type of issue (water or electricity), fill in a few details about the problem and its location, and optionally upload a photo. Once submitted, you'll receive a unique tracking ID.</p>
                  </FaqItem>
                  <FaqItem question="How can I track my complaint?">
                      <p>After you submit a report, you will receive a tracking ID. Go to the "Track Complaint" page and enter this ID to see the real-time status of your complaint, from acknowledgement to resolution.</p>
                  </FaqItem>
              </div>
              <div className="text-center mt-8">
                  <Link to="/faq" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                      View More FAQs →
                  </Link>
              </div>
          </div>
      </section>


      {/* CTA Section */}
      <section className="py-20">
          <div className="container mx-auto px-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 items-center">
                      <div className="p-8 md:p-12">
                          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-3">Ready to Make a Difference?</h2>
                          <p className="text-slate-600 dark:text-slate-400 text-lg">
                              Join thousands of citizens helping improve Navi Mumbai's infrastructure, one report at a time.
                          </p>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700/50 p-8 md:p-12 text-center flex items-center justify-center h-full">
                          <Link to="/report" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-emerald-900 font-bold py-4 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
                              <span>Report Your First Issue</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      <Chatbot />
    </>
  );
};

export default HomePage;