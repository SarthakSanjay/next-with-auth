import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />

      <div className="flex-1 text-white flex justify-center items-center overflow-auto">
        Landing Page Here ...
      </div>
    </div>
  );
}
