import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col justify-center bg-[#2b2b2b] h-screen w-screen items-center">
      <Image
        src="/soundscape-logo.png"
        alt="Soundscape Logo"
        width={500}
        height={500}
      />

      <input
        type="text"
        placeholder="Search for songs"
        style={{ background:"#3F3F3F" , caretColor: 'white', width: '550px', borderRadius: '20px', textIndent: '10px', marginBottom: '200px'}}
        className="h-10 mt-4 p-2 text-white"
      />

      <Image 
        src="/logo.png"
        alt="Byte Baddies"
        width={100}
        height={100}
        className="absolute bottom-0 mb-4"
      />
    </main>
  );
}
