"use client";

import ProfileForm from "../../components/profileform/profileform";
export default function SignupPage() {

  return (
    <div className="signup-page">
      <h1>Signup Page</h1>
      <div className="page form auth ">
        <ProfileForm variant="signup" />
      </div>
    </div>
  );
}
