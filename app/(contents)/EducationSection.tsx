import NextButton from "@/components/NextButton";
import PrevButton from "@/components/PrevButton";
import { useEducation } from "@/lib/hooks/useEducation";
import LoadingSection from "../components/LoadingSection";
import ErrorSection from "../components/ErrorSection";
import NoDataSection from "../components/NoDataSection";

interface AboutSectionProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function EducationSection({
  onNext,
  onPrevious,
}: AboutSectionProps) {
  const { educations, loading, error } = useEducation();

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorSection error={error} />;
  }

  if (!educations) {
    return <NoDataSection />;
  }

  return (
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && <PrevButton onPrevious={onPrevious} />}
      <h1 className="font-heading text-4xl sm:text-3xl mb-4 md:mb-6">
        EDUCATION
      </h1>
      <ul className="flex flex-col mx-auto max-w-5xl items-start">
        {educations.map((education, index) => (
          <li key={index} className="mb-4 w-md">
            <h3 className="font-subheading border-b-2 md:w-full border-primary pb-1 font-semibold text-xl md:text-2xl mb-1">
              {education.degree}
            </h3>
            <p>
              {education.institution} |{" "}
              <span className="font-medium">{education.year}</span>
            </p>
            {education.gpa && (
              <p>
                GPA <span className="font-medium">{education.gpa}</span>
              </p>
            )}
          </li>
        ))}
      </ul>

      <NextButton onNext={onNext} />
    </section>
  );
}
