'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import OpenAI from 'openai'

export default function Loading() {
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

      <div className="flex items-center justify-center h-screen">
        <Image
          src="/loading.gif"
          alt="Loading"
          width={200}
          height={200}
          className=""
        />
      </div>

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
  )
}
