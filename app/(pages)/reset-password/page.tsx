"use client";

import React, { useState } from "react";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import {signUp} from "../../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Step 1: Create user with better-auth
      const result = await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
      });

      if (result.error) {
        setError(result?.error?.message || "Signup failed");
        setLoading(false);
        return;
      }

      //Update user profile with additional fields
      const updateResponse = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userName,
          firstName,
          lastName,
          phoneNumber,
        }),
      });

      if (!updateResponse.ok) {
        console.error("Profile update failed");
        setError("Profile update failed");
        setLoading(false);
        return;
      }

      console.log("User signed up and profile updated");
      router.push("/");
    } catch (error) {
      setError(`An unexpected error occurred`);
      console.error(error);
      setLoading(false);
    }
  };


  return (
    <div>
      <h1>Signup Page</h1>
      <div className="page form auth">
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First Name"
            label="First Name"
            required
          />
          <Input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
            label="Last Name"
            required
          />
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            label="Email"
            required
          />
          <Input
            type="text"
            id="userName"
            label="User Name (optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Will default to first name and last initial"
          />
          <Input
            type="tel"
            id="Phone Number"
            label="Phone Number (optional)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="If you wish to receive SMS notifications"
          />
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
