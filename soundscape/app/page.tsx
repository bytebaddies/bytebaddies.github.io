"use client"
import React, {useCallback, useState} from 'react';
import Image from "next/image";
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
  const images = (require as any).context('../public/images', true);

  const [inputValue, setInputValue] = useState('');
  const [lyrics, setLyrics] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [songUrl, setSongUrl] = useState<string>("");

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

interface FetchData {
  image: string;
  name: string;
  artist: string;
  url: string;
}

const setLoadingState = (isLoading: boolean): void => {
  setIsLoading(isLoading);
};

const handleFetchError = (error: Error): void => {
  setLoadingState(false);
  console.error('Error fetching data:', error);

};

const updateStateAndNavigate = (data: FetchData): void => {
  setImageUrl(data.image);
  setName(data.name);
  setArtist(data.artist);
  setSongUrl(data.url);
  setLoadingState(false);
  console.log(data.image);
  router.push(`/tada?${createQueryString('imageUrl', data.image)}&${createQueryString('name', data.name)}&${createQueryString('artist', data.artist)}&${createQueryString('songUrl', data.url)}`);
};

const fetchData = async (url: string): Promise<void> => {
  setLoadingState(true);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: FetchData = await response.json();
    updateStateAndNavigate(data);
  } catch (error) {
    if (error instanceof Error) {
      handleFetchError(error);
    } else {
      console.error('Unexpected error:', error);
      setLoadingState(false);
    }
  }
};

const handleSearch = (): void => {
  const url: string = `http://localhost:8080/image/${inputValue}`;
  fetchData(url);
};

const handleLucky = (): void => {
  const url: string = "http://localhost:8080/lucky";
  fetchData(url);
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
          <button className="flex justify-center h-fit font-archivo font-normal text-[#2B2B2B] bg-[#D7C2A1] w-fit py-2 px-16 rounded-md" onClick={() => {handleSearch();}}>
            Search
          </button>
          <button className="flex justify-center h-fit font-archivo font-normal text-[#E4E2DE] bg-[#A12D1E] w-fit py-2 px-10 rounded-md" onClick={() => {handleLucky();}}>
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