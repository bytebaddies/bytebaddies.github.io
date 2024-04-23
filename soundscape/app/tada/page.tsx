"use client"
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from 'next/link';
import OpenAI from "openai";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Loading() {
  const searchParams = useSearchParams();
  const encodedUrl = searchParams.get("imageUrl")!;
  const title = searchParams.get("title")!;
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
    <main className="relative flex flex-col bg-[#2b2b2b] h-screen w-screen center-content" onClick={handleClick}>
      <div className="mt-10 ml-10 justify-center items-center">
        <Image
          src="/soundscape-logo.png"
          alt="Soundscape Logo"
          width={175}
          height={175}
          className="m-10"
          onClick={download}
        />
      </div>

      <img src={encodedUrl} alt="Generated Image" className='h-96 w-96 object-contain mx-auto my-auto'/>
      <div className="text-center text-xl text-white mt-4">{title}</div>
      <button onClick={download} className="mx-auto mb-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-w-xs mt-5">
        Download
      </button>

      <div className="relative flex place-items-center justify-center h-screen">
        <Image 
          src="/logo.png"
          alt="Byte Baddies"
          width={100}
          height={100}
          className="absolute inset-x-0 bottom-4 m-auto"
        />
      </div>
    </main>
  );
};
