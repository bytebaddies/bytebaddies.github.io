"use client"
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Loading() {
  const searchParams = useSearchParams();
  const encodedUrl = searchParams.get("imageUrl")!;
  const name = searchParams.get("name")!;
  const artist = searchParams.get("artist")!;
  const songUrl = searchParams.get("songUrl")!;
  const router = useRouter();

  const handleClick = async () => {
    router.back();
  };

  const download = () => {
    const link = document.createElement('a');
    link.href = encodedUrl;
    link.download = encodedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex flex-col bg-[#2b2b2b] h-screen w-screen">
      <div className="mt-10 ml-10">
        <Image
          src="/soundscape-logo.png"
          alt="Soundscape Logo"
          width={175}
          height={175}
          className="m-10 hover:cursor-pointer"
          onClick={handleClick}
        />
      </div>

      <div className="flex flex-col items-center">
        <img src={encodedUrl} alt="Generated Image" className="h-96 w-96 object-contain" />
        <h1 className="text-center text-4xl text-white mt-4">{name}</h1>
        <div className="text-center text-xl text-white mt-4">{artist}</div>
        <div className="text-center text-xl text-white mt-4">
          {songUrl.startsWith("http") ? (
            <audio autoPlay controls src={songUrl} className="w-96 mx-auto" />
          ) : (
            <p>Preview not available</p>
          )}
        </div>
        <button
          onClick={download}
          className="mx-auto mb-10 p-10 text-[#E4E2DE] bg-[#A12D1E] hover:bg-[#D7C2A1] py-2 px-4 rounded max-w-xs mt-4"
        >
          Download
        </button>
      </div>

      <div className="relative flex place-items-center justify-center h-screen p-10 bg-[#2b2b2b]">
        <Image
          src="/logo.png"
          alt="Byte Baddies"
          width={100}
          height={100}
          className="absolute inset-x-0 m-10"
        />
      </div>
    </main>
  );
};
