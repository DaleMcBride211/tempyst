
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { signOut as clientSignOut } from "next-auth/react"; 

function SignOutButton() {
  const handleSignOut = async () => {
    await clientSignOut({ redirectTo: "/" });
  };

  return (
    <Button className="bg-slate-100 text-black hover:bg-slate-200 cursor-pointer" onClick={handleSignOut}>SignOut</Button>
  )
}

export default SignOutButton;