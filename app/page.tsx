import Button from "./components/button/button";
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
    
  } else {
    console.log('no session');
  }
  
  return (
    <div className="container page home">
      <h1>Welcome to Crazy Uncle Ian's shockingly ugly</h1>
      <h2>Exquisite Corpse game!!</h2>
      <div className="page form auth">
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
