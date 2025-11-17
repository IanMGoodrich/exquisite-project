"use client";
import { useState } from "react";
import Form from "../components/form/form";
import Input from "../components/input/input";
import Button from "../components/button/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  return (
    <div>
      <h1>Login Page</h1>
      <div className="page form auth">
        <Form>
          <Input type="text" id="userName" label="Username" />
          <Input type="password" id="password" label="Password" />
          <Button type="submit" el="button" />
        </Form>
      </div>
    </div>
  );
}
