"use client";
import { useState } from "react";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { requestPasswordReset } from "../../../lib/auth-client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const result = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        setError(result?.error?.message || "Reset failed");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      setError(`An unexpected error occurred`);
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const errorTemplate = () => {
    return <div className="error-message">{error}</div>;
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <div className="page form auth">
        {error && errorTemplate()}

        {success ? (
          <div className="success-message">
            A password reset link has been sent to {email}.
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <Input
              type="email"
              id="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" el="button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
