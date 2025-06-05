'use server'

import Header from '@/components/header';
import Mainpage from '@/components/mainPage';
import { auth } from "@/auth";




export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
    <div>
      <Header />
      <Mainpage />
    </div>
    )
  }
  
  return (
    <div className="">
      <Header />
      <p>no user</p>
    </div>
  );
}
