import NextButton from "@/components/NextButton";
import PrevButton from "@/components/PrevButton";

interface AboutSectionProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

const myEdu = [
  {
    school: "Politeknik Negeri Sriwijaya",
    degree: "D3 Manajemen Informatika",
    years: "2019 - 2022",
    value: 3.65
  },
  {
    school: "SMK Negeri 8 Palembang",
    degree: "Teknik Komputer dan Jaringan",
    years: "2016 - 2019",
    value: 88
  }
]

export default function EducationSection({ onNext, onPrevious }: AboutSectionProps) {
  return (
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && (
        <PrevButton onPrevious={onPrevious} />
      )}
      <h1 className="font-heading text-4xl sm:text-3xl mb-4 md:mb-6">EDUCATION</h1>
      <ul className="flex flex-col w-full max-w-5xl mx-2 items-start">
        {myEdu.map((edu, index) => (
          <li key={index} className="mb-4 w-md">
          <h3 className="border-b-2 w-full font-semibold text-2xl">{edu.school}</h3>
          <p>{edu.degree} | <span className="font-medium">{edu.years}</span></p>
          <p>Score <span className="font-medium">{edu.value}</span></p>
        </li>
        ))}
      </ul>

      <NextButton onNext={onNext} />
    </section>
  );
}
