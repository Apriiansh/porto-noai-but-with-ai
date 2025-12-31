import CoverSection from "./(contents)/CoverSection";
import AboutSection from "./(contents)/AboutSection";
import EducationSection from "./(contents)/EducationSection";
import ExperienceSection from "./(contents)/ExperienceSection";
import ContactSection from "./(contents)/ContactSection";
import Footer from "./components/Footer/page";

export default function Home() {
  return (
    <>
      <section id="cover">
        <CoverSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="education">
        <EducationSection />
      </section>
      <section id="experience">
        <ExperienceSection />
      </section>
      <section className="flex-1" id="contact">
        <ContactSection />
      </section>
      <Footer />
      
    </>
  );
}