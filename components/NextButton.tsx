import { ArrowDownIcon } from "lucide-react";
import { Button } from "./ui/button";

interface NextButtonProps {
  onNext?: () => void;
}

export default function NextButton({ onNext }: NextButtonProps) {
  if (!onNext) return null;

  return (
    <Button
        className="hidden md:block w-12 h-8 mt-10 hover:h-10 transition-all duration-300"
        variant="outline"
        size="default"
        aria-label="Go To Next Section"
        asChild
        onClick={onNext}
      >
        <ArrowDownIcon />
      </Button>
  );
}