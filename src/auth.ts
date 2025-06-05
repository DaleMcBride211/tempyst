import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!, // More explicit, preferred
      clientSecret: process.env.GITHUB_SECRET!, // More explicit, preferred
    }),
    
  ],
  // ... other NextAuth options
})