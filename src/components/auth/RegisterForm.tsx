"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";
import SpinnerIcon from "../icons/SpinnerIcon";
import { Button } from "../ui/Button";
import PasswordInput from "../ui/PasswordInput";
import FormContainer from "../ui/FormContainer";
import Link from "next/link";

const MAX_INPUT_LENGTH = 100;

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}

export default function RegisterForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.surname) {
      newErrors.surname = "Surname is required";
    } else if (formData.surname.length < 2) {
      newErrors.surname = "Surname must be at least 2 characters";
    }

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
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log("User registered successfully:", data.user);
      router.push("/login");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormContainer>
        <form className="w-72" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <h1 className="text-lg mb-4 tracking-tight">Create your account</h1>
            <div>
              <Input
                variant="general"
                type="text"
                id="name"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                maxLength={MAX_INPUT_LENGTH}
                spellCheck={false}
                className={errors.name ? "border-red-500" : ""}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs h-6 pt-1 pl-1">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <Input
                variant="general"
                type="text"
                id="surname"
                name="surname"
                label="Surname"
                value={formData.surname}
                onChange={handleChange}
                maxLength={MAX_INPUT_LENGTH}
                spellCheck={false}
                className={errors.surname ? "border-red-500" : ""}
                required
              />
              {errors.surname && (
                <p className="text-red-500 text-xs h-6 pt-1 pl-1">
                  {errors.surname}
                </p>
              )}
            </div>
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
                spellCheck={false}
                className={errors.email ? "border-red-500" : ""}
                required
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

            <Button
              variant="primary"
              size="default"
              className="w-full leading-[30px] mt-4"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  <span>Creating account...</span>
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </FormContainer>
      <small className="mt-8 text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-cyan-600 font-semibold underline underline-offset-1 hover:text-cyan-800 transition-colors duration-200 ease-in-out"
        >
          Log in
        </Link>
      </small>
    </>
  );
}
