"use client"
import React, {useEffect, useState} from 'react';

export default function Home() {

  const [lyrics, setLyrics] = useState<string>('');
  useEffect(() => {
    // console.log("hello")
    fetch('http://localhost:8080/lyrics/Dior/Pop%20Smoke')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setLyrics(data.lyrics);
      });
  }, []);

  return (
    <main className="flex bg-[#2b2b2b] h-screen w-screen">
      <div>
        <h1>Lyrics</h1>
        <h1>{lyrics}</h1>
      </div>
    </main>
  );
}
