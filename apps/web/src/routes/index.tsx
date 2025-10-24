import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/header";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = "Opium";

function HomeComponent() {
  return (
    <>
      <Header />
      <div className="container mx-auto max-w-3xl px-4 py-2">
        <h1 className="font-bold text-4xl">{TITLE_TEXT}</h1>
        <p className="text-gray-500 text-lg">Welcome to the Opium</p>
      </div>
    </>
  );
}
