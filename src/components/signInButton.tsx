
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"

import { signIn as clientSignIn } from "next-auth/react"; 

function SignInButton() { 
  const handleSignIn = async () => {
   
    await clientSignIn('github');
  };

  return (
    <Button className="bg-slate-100 text-black hover:bg-slate-200 cursor-pointer" onClick={handleSignIn}>SignIn with Github</Button>
  )
}

export default SignInButton;