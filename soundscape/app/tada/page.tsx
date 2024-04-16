"use client"
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import OpenAI from "openai";

declare const window: any;



declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}


export default function Loading() {

  const [inputValue, setInputValue] = useState('');
  const [lyrics, setLyrics] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
    // console.log(inputValue)
  };

  const handleSearch = async () => {
    var name: string = "http://localhost:8080/lyrics/" + inputValue;
    fetch(name)
      .then(response => response.json())
      .then(data => {
        console.log(data.lyrics)
        setLyrics(data.lyrics);
      });
  };

  const handleLucky = async () => {
    var name: string = "http://localhost:8080/image/" + inputValue;
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

  useEffect(() => {
    // Load Spotify Iframe API script dynamically
    const loadSpotifyIframeApi = () => {
      const scriptUrl = 'https://embed-cdn.spotifycdn.com/_next/static/iframe_api.aab01bf20ebf65b99c73.js';
      const host = 'https://open.spotify.com';
      try {
        const ttPolicy = window.trustedTypes?.createPolicy('spotify-embed-api', {
          createScriptURL: (x: string) => x,
        });
        const trustedScriptUrl = ttPolicy ? ttPolicy.createScriptURL(scriptUrl) : scriptUrl;

        if (!window.SpotifyIframeConfig) {
          window.SpotifyIframeConfig = {};
        }
        window.SpotifyIframeConfig.host = host;

        if (window.SpotifyIframeConfig.loading) {
          console.warn('The Spotify Iframe API has already been initialized.');
          return;
        }
        window.SpotifyIframeConfig.loading = 1;

        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.id = 'spotify-iframeapi-script';
        scriptElement.src = trustedScriptUrl;
        scriptElement.async = true;

        const currentScript = document.currentScript as HTMLScriptElement | null;
        if (currentScript) {
          const nonce = currentScript.nonce || currentScript.getAttribute('nonce');
          if (nonce) {
            scriptElement.setAttribute('nonce', nonce);
          }
        }

        const firstScriptElement = document.getElementsByTagName('script')[0];

        firstScriptElement.parentNode?.insertBefore(scriptElement, firstScriptElement);
      } catch (error) {
        console.error('Error loading Spotify iFrame API:', error);
      }
    };

    loadSpotifyIframeApi();


  }, []);

  const callback = (EmbedController) => {
    EmbedController.addListener('playback_update', e => {
      // document.getElementById('progressTimestamp').innerText = `${parseInt(e.data.position / 1000, 10)} s`;
      console.log("Running:", e.data.position)
    });
  };

  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('embed-iframe');
    const options = {
      width: '100%',
      height: '100',
      uri: 'spotify:track:4ml4WlnHDEpOK8HRVYTCWf'
    };
    IFrameAPI.createController(element, options, callback);
    IFrameAPI.embed
  };


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

        <div className='absolute bottom-0 left-0 w-full h-24 px-2 pb-1 z-20'>
          <script></script>
          <div className="w-1/2 h-1/2" id="embed-iframe"></div>
        </div>

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

