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
import { ExternalLinkIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import PrevButton from "@/components/PrevButton";
import NextButton from "@/components/NextButton";
import { useProjects } from "@/lib/hooks/useProjects";
import LoadingSection from "@/app/components/LoadingSection";
import ErrorSection from "@/app/components/ErrorSection";
import NoDataSection from "@/app/components/NoDataSection";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";

interface ProjectSectionProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function ProjectSection({
  onNext,
  onPrevious,
}: ProjectSectionProps) {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorSection error={error} />;
  }

  if (!projects || projects.length === 0) {
    return <NoDataSection />;
  }

  return (
    <section className="min-h-screen max-w-7xl mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && <PrevButton onPrevious={onPrevious} />}

      <h1 className="font-heading text-4xl mb-4 sm:text-3xl md:mb-6">
        MY PROJECT AND EXPERIENCE
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 w-full">
        {projects.map((project, index) => (
          <Card
            key={index}
            className="overflow-hidden flex flex-col gap-2 hover:bg-white/10 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl group"
          >
            <CardHeader>
              <CardTitle className="text-lg md:text-xl lg:text-lg">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <HoverCard>
                <HoverCardTrigger>{project.description.split(" ").slice(0, 10).join(" ")}...</HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm">
                    {project.description}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-0.5">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-subheading"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.link &&
                  (() => {
                    const isGithub = project.link.includes("github.com");
                    return (
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {isGithub ? (
                            <FaGithub className="w-4 h-4 mr-2" />
                          ) : (
                            <ExternalLinkIcon className="w-4 h-4 mr-2" />
                          )}
                          {isGithub
                            ? "GitHub"
                            : project.type === "more"
                            ? "More"
                            : "View"}
                        </Link>
                      </Button>
                    );
                  })()}
                {project.githubLink && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="w-4 h-4 mr-2" />
                      GitHub
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
