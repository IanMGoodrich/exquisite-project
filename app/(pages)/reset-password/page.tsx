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

      //Update user profile with additional fields
      // const updateResponse = await fetch("/api/auth/reset-password", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email,
      //     token,
      //     password
      //   }),
      // });
console.log(data);

      // if (data.status) {
      //   console.error("Profile update failed");
      //   setError("Profile update failed");
      //   setLoading(false);
      //   return;
      // }

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
          {/* <Input
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
          /> */}
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
