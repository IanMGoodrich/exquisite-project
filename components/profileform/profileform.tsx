"use client";

import { type FC, useState } from "react";
import Button from "../button/button";
import Input from "../input/input";
import { type UserType } from "@/lib/types";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import "./profileform.css";
type UserProfileProps = {
  variant: "update";
  user: UserType;
};

type UserSignUpProps = {
  variant: "signup";
  user?: UserType;
};

const ProfileForm: FC<UserProfileProps | UserSignUpProps> = (props) => {
  const router = useRouter();
  const [email, setEmail] = useState(props.user?.email ?? "");
  const [userName, setUserName] = useState(props.user?.userName ?? "");
  const [firstName, setFirstName] = useState(props.user?.nameFirst ?? "");
  const [lastName, setLastName] = useState(props.user?.nameLast ?? "");
  const [phoneNumber, setPhoneNumber] = useState(props.user?.phone ?? "");
  const [image, setImage] = useState(props.user?.image ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (props.variant === "update") {
        
        const result = await fetch(`/api/${props.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userName,
            firstName,
            lastName,
            phoneNumber,
            image,
          }),
        });

        if (!result.ok) {
          setError("Failed to update profile");
          return;
        }
        alert("Profile updated successfully");
      }

      if (props.variant === "signup") {
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

        // Step 2: Update non-auth user info
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
            image,
          }),
        });

        if (!updateResponse.ok) {
          console.error("Profile update failed");
          setError("Profile update failed");
          setLoading(false);
          return;
        }

        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Input
        type="email"
        label="Email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="text"
        label="Username"
        id="userName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <Input
        type="text"
        label="First Name"
        id="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <Input
        type="text"
        label="Last Name"
        id="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Input
        type="tel"
        label="Phone Number"
        id="phone"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Input
        type="text"
        label="Image URL"
        id="image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      {props.variant === "signup" && (
        <>
          <Input
            type="password"
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Confirm Password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </>
      )}
      <Button
        el="button"
        type="submit"
        classes="profile-submit"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default ProfileForm;
