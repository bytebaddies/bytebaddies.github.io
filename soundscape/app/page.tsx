import Image from "next/image";

export default function Home() {
  return (
    <main className="flex bg-[#2b2b2b] h-screen w-screen justify-center">
      <div className="h-fit w-1/2 grid grid-rows-2 grid-flow-col justify-center">
        <div className=" font-archivo_black text-[5rem] text-[#DDD0B7] tracking-[-0.25rem]">
          soundscape
        </div>
        <div className="flex justify-center justify-items-center grid grid-cols-2 h-fit">
          <button className="flex justify-center h-fit font-archivo font-normal text-[#2B2B2B] bg-[#D7C2A1] w-fit py-2 px-16 rounded-md">
            Search
          </button>
          <button className="flex justify-center h-fit font-archivo font-normal text-[#E4E2DE] bg-[#A12D1E] w-fit py-2 px-10 rounded-md">
            i'm feeling lucky
          </button>
        </div>
      </div>

    </main>
  );
}
