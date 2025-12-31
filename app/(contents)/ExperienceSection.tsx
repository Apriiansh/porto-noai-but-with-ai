import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, ExternalLinkIcon } from "lucide-react";
import { SiGithubactions } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import PrevButton from "@/components/PrevButton";
import NextButton from "@/components/NextButton";

interface ExperienceSectionProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function ExperienceSection( { onNext, onPrevious }: ExperienceSectionProps) {
  const projects = [
    {
      title: "Attendance",
      description:
        "A mobile attendance application with GPS-based check-in and check-out features to track internship participants in real-time.",
      tech: ["Kotlin", "Firebase", "GPS", "Android Studio"],
      type: "github",
      link: "https://github.com/Apriiansh/absensi",
    },
    {
      title: "CrChive",
      description:
        "A web-based archival management system with OCR technology to support digital archiving, classification, and retention schedules.",
      tech: ["Next.js", "Supabase", "Tesseract OCR"],
      type: "both",
      link: "https://ocr-arsip.vercel.app/sign-in",
      githubLink: "https://github.com/Apriiansh/ocr-arsip",
    },
    {
      title: "Chemical Engineering Information System",
      description:
        "An academic information website for the Chemical Engineering Department of Polsri with CMS features.",
      tech: ["Next.Js", "TypeScript", "Supabase"],
      type: "both",
      link: "https://teknikkimia.polsri.ac.id/",
      githubLink: "https://github.com/amannndaptr/teknikkimia.polsri.ac.id",
    },
    {
      title: "SPI Polsri",
      description:
        "The official website of the Satuan Pengawasan Internal (SPI) of Polsri to support reports, and internal supervision information.",
      tech: ["CodeIgniter4", "PHP", "MySQL"],
      type: "both",
      link: "https://spi.polsri.ac.id/",
      githubLink: "https://github.com/Apriiansh/spi-polsri",
    },
    {
      title: "Pelakor - Pelaporan Aset Kantor",
      description:
        "A full-stack asset and inventory reporting system for Setda Ogan Ilir to manage and track office assets, equipment, and inventory with mobile and web integration.",
      tech: ["React Native", "Express.js", "PostgreSQL"],
      type: "both",
      link: "https://pelakor.oganilirkab.go.id/",
      githubLink: "https://github.com/Apriiansh/pelakor-app",
    },
    {
      title: "More Freelance Projects",
      description:
        "Various projects including software development, and technical support services such as PC building, Software Installation and Troubleshooting",
      tech: ["Software Development", "IT Support"],
      type: "more",
      link: "#",
    },
  ];

  return (
    <section className="h-screen max-w-7xl mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && (
        <PrevButton onPrevious={onPrevious} />
      )}

      <h1 className="font-heading text-4xl mb-4 sm:text-3xl md:mb-6">
        Experience
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-6 w-full">
        {projects.map((project, index) => (
          <Card
            key={index}
            className="overflow-hidden max-h-60 flex flex-col gap-1 hover:bg-white/10 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl group"
          >
            <CardHeader>
              <CardTitle className="">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p>{project.description}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-1">
                {project.tech.map((tech, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.type === "github" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.link} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="w-4 h-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                )}
                {project.type === "both" && (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={project.githubLink!} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="w-4 h-4 mr-2" />
                        GitHub
                      </Link>
                    </Button>
                  </>
                )}
                {project.type === "more" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-4 h-4 mr-2" />
                      More
                    </Link>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <NextButton onNext={onNext} />
    </section>
  );
}
