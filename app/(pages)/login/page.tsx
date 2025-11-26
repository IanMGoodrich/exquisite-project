"use client";
import { useState } from "react";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { useRouter } from "next/navigation";
import { signIn } from "../../../lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result?.error?.message || "Login failed");
        setLoading(false);
        return;
      }

      if (result.data && result.data.user) {
        const user = result.data.user;
        console.log(result);
        router.push(`/${user.id}`);
      }
      
    } catch (error) {
      setError(`An unexpected error occurred`);
      console.error(error);
      setLoading(false);
    }
  };

  const errorTemplate = () => {
    return <div className="error-message">{error}</div>;
  };

  return (
    <div>
      <h1>Login Page</h1>
      <div className="page form auth">
        {error && errorTemplate()}
        <form className="form" onSubmit={handleSubmit}>
          <Input
            type="email"
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" el="button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <Button el="link" href="/forgot-password">
          Forgot Password?
        </Button>
      </div>
    </div>
  );
}
