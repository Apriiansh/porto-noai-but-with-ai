import Link from "next/link";

import { Button } from "@/components/ui/button";
import NextButton from "@/components/NextButton";

interface CoverSectionProps {
  onNext: () => void
}

export default function CoverSection({ onNext }: CoverSectionProps ) {
  return (
    <section className="h-screen max-w-7xl mx-auto flex flex-col justify-center items-center">
      <h1 className="font-heading text-4xl mb-4 sm:text-3xl sm:mb-3">
        ApriiAnsh
      </h1>
      <h3 className="font-subheading text-3xl">PORTOFOLIO</h3>
      <Button className="my-4" variant="destructive">
        <Link href="/resume.pdf" download="resume.pdf">
          resume
        </Link>
      </Button>
      
      <NextButton onNext={onNext} />
    </section>
  );
}
