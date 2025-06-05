// src/components/signOutButton.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
// Import the client-side signOut from your auth library
import { signOut as clientSignOut } from "next-auth/react"; // Adjust the import based on your auth library

function SignOutButton() { // Component names should typically be PascalCase
  const handleSignOut = async () => {
    // Call the client-side signOut function directly
    await clientSignOut({ redirectTo: "/" });
    // You generally wouldn't call your server action `logout()` here
    // if it only contains the client-side signOut.
  };

  return (
    <Button className="bg-slate-100 text-black hover:bg-slate-200 cursor-pointer" onClick={handleSignOut}>SignOut</Button>
  )
}

export default SignOutButton;