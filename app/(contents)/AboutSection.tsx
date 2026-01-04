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
    <section className="min-h-screen mx-auto flex flex-col justify-center items-center p-4 py-20 md:py-4">
      {onPrevious && <PrevButton onPrevious={onPrevious} />}
      
      <h1 className="font-heading text-3xl sm:text-4xl mb-4 md:mb-2">
        ABOUT ME
      </h1>
      
      <Card className="w-full max-w-4xl border-border hover:border-primary transition-all duration-300">
        
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-start border-b border-border hover:border-primary transition-all duration-300 p-4 md:p-6">
          <div className="w-32 h-32 md:w-50 md:h-40 relative order-1 md:order-2 mb-4 md:mb-0 md:mr-6">
            <Image
              src={about.photo || "/profile.JPG"}
              alt="profile picture"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover shadow-accent shadow-md rounded-md"
              aria-label="Apri Photo"
            />
          </div>

          <CardHeader className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 p-0">
            <CardTitle className="font-subheading text-primary text-nowrap text-xl md:text-3xl">
              {about.name}
            </CardTitle>
            <CardDescription className="text-base sm:text-xl text-nowrap mt-1">
              {about.role}
            </CardDescription>
          </CardHeader>
        </div>

        <CardContent className="p-4 sm:p-6">
          <p className="text-sm sm:text-base leading-relaxed">
            {about.description}
          </p>
          
          <div className="mt-4 sm:mt-6">
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Skills:</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {about.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="font-subheading text-xs sm:text-sm px-2 py-0.5"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6">
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Hobbies:</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {about.hobbies.map((hobby, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="pb-1 font-subheading text-xs sm:text-sm px-2 py-0.5"
                >
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {onNext && <NextButton onNext={onNext} />}
    </section>
  );
}