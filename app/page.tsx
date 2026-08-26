import Button from "@/components/button/button";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { redirect } from 'next/navigation';


export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session && session.user?.id) {
    const userId = session.user.id;
    redirect(`/${userId}`)
    
  } //else {
   // console.log('no session');
  //}
  
  return (
    <div className="page home">
      <h1>Welcome Splendiferous Eructations!</h1>
      <h2>An Exquisite Corpse game to play with friends and other weirdos,</h2>
      <h3>and for remembering just how weird all your fiends can get.</h3>
      <div className="login-signup-buttons">
        <Button el="link" href="/login">
          Login
        </Button>
        <Button el="link" href="/signup">
          Sign Up
        </Button>
      </div>
    </div>
  );
}
