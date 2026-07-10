import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Image
          src="/images/logo.png"
          alt="Top Spin Arena"
          width={220}
          height={70}
          priority
        />

        <div className="hidden md:flex gap-8 text-white font-medium">
          <a href="#">Home</a>
          <a href="#">Book Court</a>
          <a href="#">Tournament</a>
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </nav>
  );
}