import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NextButton from "@/components/NextButton";
import PrevButton from "@/components/PrevButton";
import Image from "next/image";

interface AboutSectionProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

const myKisah = {
  name: "Muhammad Apriyansah",
  title: "Web Developer | IT Support",
  description:
    "Lulusan D3 Manajemen Informatika (IPK 3.65) dengan pengalaman praktis dalam IT Support dan Web Development. Telah menyelesaikan 4 proyek digitalisasi dan magang sebagai IT Support & Administration Intern di Dinas Kearsipan Provinsi Sumatera Selatan. Kompeten dalam troubleshooting hardware/software, maintenance perangkat IT (komputer, printer, scanner), serta pengembangan aplikasi web menggunakan Next.js dan CodeIgniter. Memiliki kemampuan analitis dan problem-solving yang baik serta multitasking dalam mengelola beberapa proyek sekaligus sambil memberikan technical support berkualitas. Berkomitmen untuk berkontribusi dalam peran IT yang memberikan peluang pertumbuhan profesional berkelanjutan." 
};

export default function AboutSection({
  onNext,
  onPrevious,
}: AboutSectionProps) {
  return (
    
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && <PrevButton onPrevious={onPrevious} />}
      <h1 className="font-heading text-4xl sm:text-3xl sm:mb-3">ABOUT ME</h1>
      <Card className="w-full max-w-4xl mt-5 border-border hover:border-primary transition-all duration-300">
        <div className="flex justify-between items-center border-b border-border hover:border-primary transition-all duration-300">
          <CardHeader className="flex flex-col whitespace-nowrap">
            <CardTitle className="font-heading text-primary text-2xl">
              {myKisah.name}
            </CardTitle>
            <CardDescription className="text-xl">
              {myKisah.title}
            </CardDescription>
          </CardHeader>
          <Image
            src="/profile.JPG"
            alt="profile picture"
            width={140}
            height={100}
            aria-label="Apri Photo"
            className="shadow-accent shadow-md/20 rounded-md m-4"
          />
        </div>

        <CardContent>
          <p>
            {myKisah.description}
          </p>
        </CardContent>
      </Card>

      <NextButton onNext={onNext} />
    </section>
  );
}
