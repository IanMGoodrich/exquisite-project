import Button from "./components/button/button";

export default async function Home() {
  return (
    <div>
      <Button el="link" href="/login">
        Login
      </Button>
      <Button el="link" href="/signup">
        Sign Up
      </Button>
      <Button el="link" href="/dashboard">
        Dashboard
      </Button>
    </div>
  );
}
