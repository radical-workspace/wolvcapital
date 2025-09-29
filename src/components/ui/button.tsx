"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({ variant = "default", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium";
  const style =
    variant === "outline"
      ? "border border-gray-300 hover:bg-gray-50"
      : "bg-black text-white hover:opacity-90";
  return <button className={`${base} ${style} ${className}`} {...props} />;
}
