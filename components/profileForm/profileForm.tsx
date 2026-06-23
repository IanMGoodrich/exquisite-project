"use client";

import { type FC, useState } from "react";
import Button from "../button/button";
import Input from "../input/input";
import DragAndDrop from "../dragAndDrop/dragAndDrop";
import PellEditor from "../pellEditor/pellEditor";
import 'pell/dist/pell.min.css';
import { type UserType } from "@/lib/types";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import "./profileForm.css";

type UserProfileProps = {
  variant: "update";
  user: UserType;
};

type UserSignUpProps = {
  variant: "signup";
  user?: UserType;
};

async function uploadImageToS3(file: File): Promise<string> {
  let presignRes: Response;

  try {
    presignRes = await fetch("/api/images/presigned-url/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: file.type,
        contentLength: file.size,
      }),
    });
  } catch (err) {
    throw new Error("Could not reach the upload API. Is your dev server running?");
  }

  const contentType = presignRes.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await presignRes.text();
    throw new Error(`Upload setup failed (${presignRes.status})`);
  }

  if (!presignRes.ok) {
    const { error } = await presignRes.json();
    throw new Error(error ?? "Could not get upload URL");
  }

  const { presignedUrl, publicUrl } = await presignRes.json() as {
    presignedUrl: string;
    publicUrl: string;
  };


try {
  const s3Res = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!s3Res.ok) {
    const text = await s3Res.text();
    throw new Error(`S3 responded with ${s3Res.status}: ${text}`);
  }
} catch (err) {
  const errorMsg = err instanceof Error ? err.message : "Unknown error";
  if (errorMsg.includes("CORS")) {
    throw new Error("File could not be uploaded to storage. Check your S3 CORS configuration.");
  }
  throw new Error(`File upload failed: ${errorMsg}`);
}

  return publicUrl;
}

const ProfileForm: FC<UserProfileProps | UserSignUpProps> = (props) => {
  const router = useRouter();
  const [email, setEmail] = useState(props.user?.email ?? "");
  const [userName, setUserName] = useState(props.user?.userName ?? "");
  const [firstName, setFirstName] = useState(props.user?.nameFirst ?? "");
  const [lastName, setLastName] = useState(props.user?.nameLast ?? "");
  const [phoneNumber, setPhoneNumber] = useState(props.user?.phone ?? "");
  const [profileColumnOne, setProfileColumnOne] = useState(props.user?.profileColumnOne ?? "");
  const [profileColumnTwo, setProfileColumnTwo] = useState(props.user?.profileColumnTwo ?? "");
  const [image, setImage] = useState(props.user?.image ?? "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFileAccepted = async (file: File) => {
    setImageUploading(true);
    setImageError("");
    setImage("");

    try {
      const publicUrl = await uploadImageToS3(file);
      setImage(publicUrl);
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : "Image upload failed. Please try again."
      );
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileRejected = (errors: string[]) => {
    setImageError(errors[0] ?? "File not accepted");
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUploading) return;
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
            profileColumnOne: DOMPurify.sanitize(profileColumnOne),
            profileColumnTwo: DOMPurify.sanitize(profileColumnTwo),
          }),
        });

        if (!result.ok) {
          setError("Failed to update profile");
          return;
        }
        router.push(`/${props.user.id}`);
      }

      if (props.variant === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

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

        const updateResponse = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userName,
            firstName,
            lastName,
            phoneNumber,
            image,
            profileColumnOne,
            profileColumnTwo,
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

  const buttonText = props.variant === "signup" ? "Sign Up" : "Update Profile";
  const isDisabled = loading || imageUploading;

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

      <DragAndDrop
        id="image"
        label="Profile Image (optional)"
        onFileAccepted={handleFileAccepted}
        onFileRejected={handleFileRejected}
        accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] }}
        maxSize={5 * 1024 * 1024}
        placeholder="Drop your photo here, or click to browse"
        disabled={imageUploading}
      />

      {imageUploading && (
        <p className="image-status image-status--uploading" role="status" aria-live="polite">
          Uploading image…
        </p>
      )}
      {imageError && (
        <p className="image-status image-status--error" role="alert">
          {imageError}
        </p>
      )}
      {!imageUploading && !imageError && image && (
        <p className="image-status image-status--success" role="status">
          Image uploaded successfully.
        </p>
      )}

      <PellEditor
        id="profileColumnOne"
        label="Upper profile text"
        value={profileColumnOne}
        onChange={(content) => setProfileColumnOne(content)}
      />
      <PellEditor
        id="profileColumnTwo"
        label="Lower profile text"
        value={profileColumnTwo}
        onChange={(content) => setProfileColumnTwo(content)}
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

      <Button
        classes="profile-submit"
        type="submit"
        el="button"
        disabled={isDisabled}
      >
        {imageUploading ? "Uploading image…" : loading ? "Updating..." : buttonText}
      </Button>
    </form>
  );
};

export default ProfileForm;
