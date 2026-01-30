"use client";

import { type FC, useState } from "react";
import Button from "../button/button";
import Input from "../input/input";
import { type UserType } from "../../../lib/types";
import { signUp } from "../../../lib/auth-client";
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
        router.push("/");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const buttonText = props.variant==="signup" ? "Sign Up" : "Update Profile"; 
  
  return (
    <form className="profile-form" onSubmit={handleSubmit}>
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
        id="phoneNumber"
        label="Phone Number (optional)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="If you wish to receive SMS notifications"
      />
      <Input
        type="text"
        id="image"
        label="Profile Image (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Add image URL"
      />
      {props.variant === "signup" && (
        <>
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
        </>
      )}
      {error && <p className="error">{error}</p>}
      <Button classes="profile-submit" type="submit" el="button" disabled={loading}>
        {loading ? "Updating..." : `${buttonText}`}
      </Button>
    </form>
  );
};

export default ProfileForm;
