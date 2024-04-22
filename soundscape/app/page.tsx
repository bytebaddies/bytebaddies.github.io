"use client"
import React, {useCallback, useEffect, useState} from 'react';
import Image from "next/image";
import Link from 'next/link';
import OpenAI from "openai";
// import {useNavigate} from "react-router-dom";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  );

  // let url = new URL("http://localhost:3000/tada/");
  // let params = new URLSearchParams(url.search);
  const [inputValue, setInputValue] = useState('');
  const [lyrics, setLyrics] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
    // console.log(inputValue)
  };

  
  const handleSearch = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    var name = "http://localhost:8080/image/" + inputValue; 
    try {
      const response = await fetch(name);
      const data = await response.json();
      setImageUrl(data.image);
      setIsLoading(false); // Set loading to false when fetch is successful
      console.log(data.image);
      router.push('/tada' + '?' + createQueryString('imageUrl', data.image));
      
    } catch (error) {
      setIsLoading(false); // Set loading to false on fetch error
      console.error('Error fetching image URL:', error);
      // Handle error
    }
  };
  
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
        value={inputValue} 
        onChange={handleInputChange}
      />

      <div className="flex justify-center justify-items-center grid grid-cols-2 mt-[1rem]">
        {/* <Link href="/loading"> */}
          <button className="flex justify-center h-fit font-archivo font-normal text-[#2B2B2B] bg-[#D7C2A1] w-fit py-2 px-16 rounded-md" onClick={() => {handleSearch();}}>
            Search
          </button>
        {/* </Link> */}
        <Link href="/loading">
          <button className="flex justify-center h-fit font-archivo font-normal text-[#E4E2DE] bg-[#A12D1E] w-fit py-2 px-10 rounded-md" onClick={() => {handleSearch();}}>
            i'm feeling lucky
          </button>
        </Link>
        </div>
      </div>

      <Image 
        src="/logo.png"
        alt="Byte Baddies"
        width={100}
        height={100}
        className="absolute bottom-0 mb-4"
      />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex items-center justify-center h-screen">
            <Image 
              src="/loading.gif"
              alt="Loading"
              width={200}
              height={200}
              className=""
            />
        </div>
        </div>
      )}
    </main>
  );
}
