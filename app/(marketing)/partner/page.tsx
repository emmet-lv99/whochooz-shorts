'use client';

import { useState } from 'react';
import '../marketing.css';
import PartnerCTA from './_components/PartnerCTA';
import PartnerHero from './_components/PartnerHero';
import PartnerProblem from './_components/PartnerProblem';
import PartnerProcess from './_components/PartnerProcess';
import PartnerSolution from './_components/PartnerSolution';
import PartnerSuccess from './_components/PartnerSuccess';

export default function PartnerLandingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollToCTA = () => {
    const ctaSection = document.getElementById('partner-cta');
    ctaSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="partner-wrapper min-h-screen flex items-center justify-center relative font-sans break-keep text-white">
        <div className="partner-background fixed inset-0">
          <div className="aurora-blob blob-lime" />
          <div className="aurora-blob blob-purple" />
        </div>
        <div className="noise-overlay" />
        <PartnerSuccess />
      </div>
    );
  }

  return (
    <div className="partner-wrapper min-h-screen relative font-sans break-keep text-white selection:bg-[#C6F920] selection:text-black">
      {/* Global Fixed Background */}
      <div className="partner-background fixed inset-0">
        <div className="aurora-blob blob-lime" />
        <div className="aurora-blob blob-purple" />
        <div className="aurora-blob blob-white" />
      </div>
      <div className="noise-overlay fixed inset-0" />

      {/* Sections */}
      <main className="relative z-10 w-full overflow-hidden">
        <PartnerHero onScrollToCTA={scrollToCTA} />
        <PartnerProblem />
        <PartnerSolution />
        <PartnerProcess />
        <PartnerCTA onSuccess={() => setIsSubmitted(true)} />
      </main>
    </div>
  );
}
