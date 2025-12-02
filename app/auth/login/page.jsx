"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client.js.js";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      alert("❌ Login failed: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center" }}>
      <h1 style={{ marginBottom: 20 }}>Inspector Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{
            padding: "12px",
            width: "100%",
            marginBottom: "14px",
            borderRadius: "6px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{
            padding: "12px",
            width: "100%",
            marginBottom: "14px",
            borderRadius: "6px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            background: "#C8A36D",
            color: "white",
            borderRadius: "6px",
            width: "100%",
            marginTop: "10px",
          }}
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}
