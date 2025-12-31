interface ErrorSectionProps {
  error: string;
}

export default function ErrorSection({ error }: ErrorSectionProps) {
  return (
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      <p>Error: {error}</p>
    </section>
  );
}