"use client";

import React, { useState } from "react";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import { resetPassword } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }  
      if (!token) {
        setError("No security token detected");
        setLoading(false);
        return;
      }
    

      // Update password
      const {data, error} = await resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(error?.message || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (error) {
      setError(`An unexpected error occurred`);
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <h1>Signup Page</h1>
      <div className="page form auth">
        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            label="Password"
            required
          />
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Retype Password"
            label="Confirm Password"
            required
          />
          {error && <p className="error">{error}</p>}
          <Button type="submit" el="button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
