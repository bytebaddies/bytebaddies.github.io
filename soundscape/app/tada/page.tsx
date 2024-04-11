"use client"
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from 'next/link';
import OpenAI from "openai";

export default function Loading() {

  const [inputValue, setInputValue] = useState('');
  const [lyrics, setLyrics] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
    // console.log(inputValue)
  };

  const handleSearch = async () => {
    var name:string = "http://localhost:8080/lyrics/" + inputValue; 
    fetch(name)
      .then(response => response.json())
      .then(data => {
        console.log(data.lyrics)
        setLyrics(data.lyrics);
      });
  };

  const handleLucky = async () => {
    var name:string = "http://localhost:8080/image/" + inputValue; 
    fetch(name)
      .then(response => response.json())
      .then(data => {
        console.log(data.image)
        setImageUrl(data.image);
      });
    // const response = await fetch('/image');
    // const data = await response.json();
    // console.log(data);
    // setImageUrl(data);
  };

  // useEffect(() => {
  //   // console.log("hello")
  //   var name:string = "http://localhost:8080/lyrics/" + inputValue; 
  //   fetch(name)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data.lyrics)
  //       setLyrics(data.lyrics);
  //     });
  // }, []);
  
  return (
    <main className="relative flex flex-col bg-[#2b2b2b] h-screen w-screen">
      <div className="mt-10 ml-10">
        <Image
          src="/soundscape-logo.png"
          alt="Soundscape Logo"
          width={175}
          height={175}
          className=""
        />
      </div>

      <img src={imageUrl} alt="Generated Image" />

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

