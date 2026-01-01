import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      <Spinner />
    </section>
  );
}