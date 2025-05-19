"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import SpinnerIcon from "../icons/SpinnerIcon";
import { Input } from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import Link from "next/link";
import FormContainer from "../ui/FormContainer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const MAX_INPUT_LENGTH = 100;

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user);

      console.log("Login successful:", data.user);

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <SpinnerIcon />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <>
      <FormContainer>
        <form className="w-72" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <h1 className="text-lg mb-4 tracking-tight">
              Sign in to your account
            </h1>
            <div>
              <Input
                variant="general"
                type="email"
                id="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                maxLength={MAX_INPUT_LENGTH}
                autoComplete="username"
                spellCheck={false}
                required
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs h-6 pt-1 pl-1">
                  {errors.email}
                </p>
              )}
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            {errorMessage && (
              <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                {errorMessage}
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="default"
            className="w-full mt-4 leading-[30px]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <SpinnerIcon />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </FormContainer>
      <small className="mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-cyan-600 font-semibold underline underline-offset-1 hover:text-cyan-800 transition-colors duration-200 ease-in-out"
        >
          Register
        </Link>
      </small>
    </>
  );
}
