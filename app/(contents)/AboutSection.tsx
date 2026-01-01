import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NextButton from "@/components/NextButton";
import PrevButton from "@/components/PrevButton";
import Image from "next/image";
import { About } from "@/lib/definitions";
import { useAbout } from "@/lib/hooks/useAbout";
import LoadingSection from "@/app/components/LoadingSection";
import ErrorSection from "@/app/components/ErrorSection";
import NoDataSection from "@/app/components/NoDataSection";

interface AboutSectionProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function AboutSection({
  onNext,
  onPrevious,
}: AboutSectionProps) {
  const { about, loading, error } = useAbout();

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorSection error={error} />;
  }

  if (!about) {
    return <NoDataSection />;
  }

  return (
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && <PrevButton onPrevious={onPrevious} />}
      <h1 className="font-heading text-4xl sm:text-3xl sm:mb-3">ABOUT ME</h1>
      <Card className="w-full max-w-4xl mt-5 border-border hover:border-primary transition-all duration-300">
        <div className="flex justify-between items-center border-b border-border hover:border-primary transition-all duration-300">
          <CardHeader className="flex flex-col whitespace-nowrap">
            <CardTitle className="font-subheading text-primary text-2xl">
              {about.name}
            </CardTitle>
            <CardDescription className="font- text-xl">
              {about.role}
            </CardDescription>
          </CardHeader>
          <div className="w-35 h-25 relative m-4">
            <Image
              src={about.photo || "/profile.JPG"}
              alt="profile picture"
              fill
              sizes="140px"
              className="object-cover shadow-accent shadow-md/20 rounded-md"
              aria-label="Apri Photo"
            />
          </div>
        </div>

        <CardContent>
          <p>
            {about.description}
          </p>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {about.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="font-subheading">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Hobbies:</h3>
            <div className="flex flex-wrap gap-2">
              {about.hobbies.map((hobby, index) => (
                <Badge key={index} variant="outline" className="pb-1 font-subheading">
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <NextButton onNext={onNext} />
    </section>
  );
}
