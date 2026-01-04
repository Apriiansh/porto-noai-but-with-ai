'use client'

import CoverSection from "./(contents)/CoverSection";
import AboutSection from "./(contents)/AboutSection";
import EducationSection from "./(contents)/EducationSection";
import ContactSection from "./(contents)/ContactSection";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProjectSection from "./(contents)/ProjectSection";

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
    <div className="overflow-x-hidden w-full">
      <Navbar progress={progress} />
      <section id="cover">
        <CoverSection onNext={() => handleScrollToSection("about")} />
      </section>
      <section id="about">
        <AboutSection onNext={() => handleScrollToSection("education")} onPrevious={() => handleScrollToSection("cover")} />
      </section>
      <section id="education">
        <EducationSection onNext={() => handleScrollToSection("projects")} onPrevious={() => handleScrollToSection("about")} />
      </section>
      <section id="projects">
        <ProjectSection onNext={() => handleScrollToSection("contact")} onPrevious={() => handleScrollToSection("education")} />
      </section>
      <section className="flex-1" id="contact">
        <ContactSection onPrevious={() => handleScrollToSection("projects")} onCover={() => handleScrollToSection("cover")} />
      </section>
      <Footer />
    </div>
  );
}
