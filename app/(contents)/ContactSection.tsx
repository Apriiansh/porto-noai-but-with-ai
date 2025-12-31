import PrevButton from "@/components/PrevButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, ArrowUpToLine } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

interface ContactSectionProps {
  onCover?: () => void;
  onPrevious?: () => void;
}

const myContact = {
  yapping: "Feel free to reach out for collaborations or just to say hi!",
  email: "apriansyahmlp@gmail.com",
  phone: "+62 822-7951-2377",
  linkGithub: "https://github.com/Apriiansh",
  linkLinkedin: "https://www.linkedin.com/in/apriiansh27",
}

export default function ContactSection({ onCover, onPrevious }: ContactSectionProps) {
  return (
    <section className="min-h-screen mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && (
        <PrevButton onPrevious={onPrevious} />
      )}
      <h1 className="font-heading text-4xl sm:text-3xl mb-8">CONTACT</h1>

        <Card>
          <CardHeader>
            <CardTitle>Get In Touch</CardTitle>
            <CardDescription>{myContact.yapping}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <span>{myContact.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <span>{myContact.phone}</span>
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" size="icon" asChild>
                <a href={myContact.linkGithub} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={myContact.linkLinkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>


      <Button
        className="w-12 h-8 mt-10 hover:h-10 transition-all duration-300"
        variant="outline"
        size="default"
        aria-label="Go To Cover"
        onClick={onCover}
      >
        <ArrowUpToLine />
      </Button>
    </section>
  );
}
