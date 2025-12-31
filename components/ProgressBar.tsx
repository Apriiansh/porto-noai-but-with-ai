import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

interface ProgressBarProps {
  value?: number;
}

export default function ProgressBar({ value = 0 }: ProgressBarProps) {
  const [progres, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <Progress className="w-[80%]" value={progres} />
  )
}