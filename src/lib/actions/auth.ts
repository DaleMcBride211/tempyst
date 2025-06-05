'use server'

import { signIn, signOut } from "next-auth/react"

export const login = async (): Promise<void> => {
    await signIn("github", { redirectTo: "/" });
};

export const logout = async (): Promise<void> => {
    await signOut({ redirectTo: "/" });
};