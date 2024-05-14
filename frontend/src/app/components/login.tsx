"use client";

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/authContext";
import { AxiosError } from "axios";
import { INVALID_PASSWORD, USER_NOT_FOUND } from "../errors/constants";
import { useRouter } from "next/navigation";

export interface FieldsLogin {
  username: string;
  password: string;
}

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldsLogin>();

  const [error, setError] = useState<string | null>(null);
  const { signIn } = useContext(AuthContext);
  const router = useRouter();

  const onSubmitHandler = async (data: FieldsLogin) => {
    try {
      await signIn(data);
      router.push("dashboard");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (
          error.response?.data.message == USER_NOT_FOUND ||
          error.response?.data.message == INVALID_PASSWORD
        ) {
          setError(error.response?.data.message);
        } else {
          setError("Error");
        }
      } else {
        setError("Error");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">TO DO LIST</h1>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            style={{ color: "black" }}
            {...register("username", { required: "Username is required" })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.username ? "border-red-500" : ""
            }`}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            style={{ color: "black" }}
            {...register("password", { required: "Password is required" })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
