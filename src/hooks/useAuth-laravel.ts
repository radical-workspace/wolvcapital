"use client";
import React, { useState } from "react";
import { apiPost } from "../lib/api";

export function useAuthLaravel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost("/auth/login", { email, password });
      return data;
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
