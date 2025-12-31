'use client'

import CoverSection from "./(contents)/CoverSection";
import AboutSection from "./(contents)/AboutSection";
import EducationSection from "./(contents)/EducationSection";
import ExperienceSection from "./(contents)/ExperienceSection";
import ContactSection from "./(contents)/ContactSection";
import Footer from "./components/Footer/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/page";

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element
      ? element.scrollIntoView({ behavior: "smooth" })
      : router.push(`/#${sectionId}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (
    <>
      <Navbar progress={progress} />
      <section id="cover">
        <CoverSection onNext={() => handleScrollToSection("about")} />
      </section>
      <section id="about">
        <AboutSection onNext={() => handleScrollToSection("education")} onPrevious={() => handleScrollToSection("cover")} />
      </section>
      <section id="education">
        <EducationSection onNext={() => handleScrollToSection("experience")} onPrevious={() => handleScrollToSection("about")} />
      </section>
      <section id="experience">
        <ExperienceSection onNext={() => handleScrollToSection("contact")} onPrevious={() => handleScrollToSection("education")} />
      </section>
      <section className="flex-1" id="contact">
        <ContactSection onPrevious={() => handleScrollToSection("experience")} onCover={() => handleScrollToSection("cover")} />
      </section>
      <Footer />
    </>
  );
}
