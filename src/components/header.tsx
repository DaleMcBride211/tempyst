'use server'
import React from 'react'
import SignInButton from '@/components/signInButton'
import SignOutButton from '@/components/signOutButton'
import { auth } from "@/auth";
import Image from "next/image";
 // Example: using Lucide icons

async function Header() { 
  const session = await auth();

  
  const headerBg = "bg-sky-600"; 
  const textColor = "text-white"; 

  return (
    <header className={`flex justify-between items-center w-full p-3 ${headerBg} ${textColor} shadow-md`}>
     
      <div className="flex items-center">
        
        <Image
          src="/tempystlogo.png" // Assuming it's in the public folder
          alt="Tempyst Logo"
          width={60} // Adjust as needed
          height={60} // Adjust as needed
          className="mr-3 rounded-[50%]"
           // Add some margin if next to text or other elements
        />
        <p className="text-3xl font-bold">Tempyst</p>
        
      </div>

      

      {/* Right: User Auth */}
      <div className="flex items-center gap-3">
        {session?.user ? (
          <>
            <p className="text-md hidden sm:block"> {/* Hide on small screens if too crowded */}
              Welcome, {session.user.name?.split(' ')[0]} {/* Show first name */}
            </p>
            {session.user.image && (
              <Image
                src={session.user.image}
                width={40}
                height={40}
                alt={session.user.name ?? "Avatar"}
                className="rounded-full border-2 border-white/50"
              />
            )}
            <SignOutButton />
          </>
        ) : (
          <>
            <p className="text-md hidden sm:block">Guest</p>
            <SignInButton />
          </>
        )}
      </div>
    </header>
  )
}

export default Header;