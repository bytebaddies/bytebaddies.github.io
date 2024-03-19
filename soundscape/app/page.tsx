import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col bg-[#2b2b2b] h-screen w-screen place-items-center justify-center">
      <div className=" flex justify-center place-items-center grid grid-cols-1 grid-rows-3 w-fit h-fit">

      <Image
        src="/soundscape-logo.png"
        alt="Soundscape Logo"
        width={500}
        height={500}
        className="h-fit"
      />
    
      <input
        type="text"
        placeholder="Search for songs"
        className="h-[3rem] p-2 text-white bg-[#3F3F3F] rounded-md caret-white w-[40rem] rounded-3xl mt-[1rem] indent-2"
      />

      <div className="flex justify-center justify-items-center grid grid-cols-2 mt-[1rem]">
        <button className="flex justify-center h-fit font-archivo font-normal text-[#2B2B2B] bg-[#D7C2A1] w-fit py-2 px-16 rounded-md">
          Search
        </button>
        <button className="flex justify-center h-fit font-archivo font-normal text-[#E4E2DE] bg-[#A12D1E] w-fit py-2 px-10 rounded-md">
          i'm feeling lucky
        </button>
      </div>
      </div>

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
