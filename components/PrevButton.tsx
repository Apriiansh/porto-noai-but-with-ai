import { ArrowUpIcon } from "lucide-react";
import { Button } from "./ui/button";

interface PrevButtonProps {
  onPrevious?: () => void;
}

export default function PrevButton({ onPrevious }: PrevButtonProps) {
  if (!onPrevious) return null;

  return (
    <Button
        className="hidden md:block w-12 h-8 mb-10 hover:h-10 transition-all duration-300"
        variant="outline"
        size="default"
        aria-label="Go To Previous Section"
        asChild
        onClick={onPrevious}
      >
        <ArrowUpIcon />
      </Button>
  );
}