import React, { useState } from 'react';

interface FaqItemProps {
  question: string;
  children: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

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

const FaqPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Find answers to common questions about AquaVolt.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md transition-colors duration-300">
          <FaqItem question="What is AquaVolt?">
            <p>AquaVolt is a streamlined, unified platform for citizens of Navi Mumbai to report and track civic issues related to water and electricity supply. Our goal is to make communication with civic bodies like CIDCO and MSEDCL faster and more transparent.</p>
          </FaqItem>
          <FaqItem question="How do I report an issue?">
            <p>Simply click on the "Report Issue" link in the navigation bar. You'll be asked to choose the type of issue (water or electricity), then a specific sub-category. After that, fill in a few details about the problem and its location, and optionally upload a photo. Once submitted, you'll receive a unique tracking ID.</p>
          </FaqItem>
          <FaqItem question="Who are CIDCO and MSEDCL?">
            <p>CIDCO (City and Industrial Development Corporation) is primarily responsible for water supply management in Navi Mumbai. MSEDCL (Maharashtra State Electricity Distribution Co. Ltd.) is responsible for electricity distribution and management. AquaVolt ensures your complaint is directed to the correct authority.</p>
          </FaqItem>
          <FaqItem question="What happens after I submit a report?">
            <p>Once you submit a report, it is forwarded to the appropriate department (CIDCO or MSEDCL). You'll receive a tracking ID to monitor its status on our "Track Complaint" page. You can see updates as your complaint is acknowledged, assigned to a team, and resolved.</p>
          </FaqItem>
          <FaqItem question="How can I track my complaint?">
            <p>After you submit a report, you will receive a tracking ID via SMS/Email. Go to the "Track Complaint" page and enter this ID to see the real-time status of your complaint, from acknowledgement to resolution.</p>
          </FaqItem>
          <FaqItem question="Can I report an issue anonymously?">
            <p>Currently, we require basic contact information to provide you with a tracking ID and updates. However, your personal details are kept confidential and are only used for communication regarding your complaint.</p>
          </FaqItem>
          <FaqItem question="What if my issue is not resolved in the estimated time?">
             <p>The estimated resolution time is an approximation. If your issue is taking longer than expected, you can check the timeline on the tracking page for any updates from the assigned team. Delays can sometimes occur due to the complexity of the issue or unforeseen circumstances.</p>
          </FaqItem>
          <FaqItem question="Is this service free?">
            <p>Yes, AquaVolt is a completely free service for all citizens. It is designed to empower residents and improve civic infrastructure.</p>
          </FaqItem>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;