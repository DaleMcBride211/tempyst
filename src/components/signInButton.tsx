// src/components/signInButton.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
// 1. Import the client-side signIn from your auth library
import { signIn as clientSignIn } from "next-auth/react"; // Adjust if using a different library

function SignInButton() { // Component names should typically be PascalCase
  const handleSignIn = async () => {
   
    await clientSignIn('github');
  };

  return (
    <Button className="bg-slate-100 text-black hover:bg-slate-200 cursor-pointer" onClick={handleSignIn}>SignIn with Github</Button>
  )
}

export default SignInButton;