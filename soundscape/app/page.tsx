"use client"
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import OpenAI from "openai";

export default function Home() {
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
        <button className="flex justify-center h-fit font-archivo font-normal text-[#2B2B2B] bg-[#D7C2A1] w-fit py-2 px-16 rounded-md" onClick={() => {handleLucky();}}>
          Search
        </button>
        <button className="flex justify-center h-fit font-archivo font-normal text-[#E4E2DE] bg-[#A12D1E] w-fit py-2 px-10 rounded-md" onClick={() => {handleLucky();}}>
          i'm feeling lucky
        </button>
        <img src={imageUrl} alt="Generated Image" />
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
