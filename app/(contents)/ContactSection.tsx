import PrevButton from "@/components/PrevButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useContact } from "@/lib/hooks/useContact";
import { Mail, Phone, ArrowUpToLine } from "lucide-react";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import LoadingSection from "../components/LoadingSection";
import ErrorSection from "../components/ErrorSection";
import NoDataSection from "../components/NoDataSection";

interface ContactSectionProps {
  onCover?: () => void;
  onPrevious?: () => void;
}

export default function ContactSection({ onCover, onPrevious }: ContactSectionProps) {
  const { contact, loading, error, refetch } = useContact();

    if (loading) {
      return <LoadingSection />;
    }
  
    if (error) {
      return <ErrorSection error={error} />;
    }
  
    if (!contact) {
      return <NoDataSection />;
    }

  return (
    <section className="min-h-screen mx-auto flex flex-col justify-center items-center p-4">
      {onPrevious && (
        <PrevButton onPrevious={onPrevious} />
      )}
      <h1 className="font-heading text-4xl sm:text-3xl mb-8">CONTACT</h1>

        <Card className="w-full max-w-2xl min-h-80 p-6 items-start justify-center text-nowrap">
          <CardHeader>
            <CardTitle>Get In Touch</CardTitle>
            <CardDescription>{contact.yapping}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <span>{contact.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" size="icon" asChild>
                <a href={contact.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="w-4 h-4" />
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
