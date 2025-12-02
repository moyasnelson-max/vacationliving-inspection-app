"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function LoginPage() {
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Inspector Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}