"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "../api/api";

export interface FieldsRegister {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldsRegister>();

  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const onSubmitHandler = async (data: FieldsRegister) => {
    try {
      const response = await api.post(`user/create/`, {
        name: data.name,
        username: data.username,
        password: data.password,
      });
      if (response.status === 201) {
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const password = watch("password");

  const closeModalAndRedirect = () => {
    setShowModal(false);
    router.push("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">REGISTER</h1>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white">
            Name
          </label>
          <input
            type="text"
            id="name"
            style={{ color: "black" }}
            {...register("name", { required: "Name is required" })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-white">
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
          <label htmlFor="password" className="block text-white">
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

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-white">
            Confirm password
          </label>
          <input
            type="password"
            id="confirmPassword"
            style={{ color: "black" }}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-black text-2xl mb-4">User registered!</h2>
            <button
              onClick={closeModalAndRedirect}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
