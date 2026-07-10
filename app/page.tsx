import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Availability from "../components/Availability";

export default function Home() {
  return (
    <main className="bg-slate-950">
      <Navbar />
      <Hero />
      <Availability />
    </main>
  );
}