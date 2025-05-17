"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import SpinnerIcon from "../icons/SpinnerIcon";
import { Input } from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";

import { Button } from "../ui/Button";
import Link from "next/link";
import FormContainer from "../ui/FormContainer";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

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
      // Simulated login (replace this with real logic later)
      await new Promise((res) => setTimeout(res, 1000));
      console.log("Submitted credentials:", formData);

      // Example redirect (optional)
      // router.push("/dashboard");
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
