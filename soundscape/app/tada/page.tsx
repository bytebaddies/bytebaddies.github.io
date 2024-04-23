"use client"
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import OpenAI from "openai";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Loading() {

  const searchParams = useSearchParams();
  const encodedUrl = searchParams.get("imageUrl")!;
  const router = useRouter();

  const handleClick = async () => {
    router.back();
  }

  return (
    <main className="relative flex flex-col bg-[#2b2b2b] h-screen w-screen">
      <div className="mt-10 ml-10 hover:cursor-pointer" onClick={handleClick}>
        <Image
          src="/soundscape-logo.png"
          alt="Soundscape Logo"
          width={175}
          height={175}
          className=""
        />
      </div>

      <img src={encodedUrl} alt="Generated Image" />

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

