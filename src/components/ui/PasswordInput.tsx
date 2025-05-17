"use client";

import React, { useState, ChangeEvent } from "react";
import { Input } from "./Input";
import PasswordShowIcon from "../icons/PasswordShowIcon";
import PasswordHideIcon from "../icons/PasswordHideIcon";

const MAX_INPUT_LENGTH = 100;

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  error,
  className = "",
  required = false,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        variant="general"
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        maxLength={MAX_INPUT_LENGTH}
        autoComplete={autoComplete}
        className={`w-full border rounded p-2 pr-10 relative ${
          error ? "border-red-500" : ""
        } ${className}`}
        required={required}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute top-[50%] transform -translate-y-1/2 left-[255px]"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <PasswordShowIcon /> : <PasswordHideIcon />}
      </button>
      {error && <p className="text-red-500 text-xs h-6 pt-1 pl-1">{error}</p>}
    </div>
  );
}
