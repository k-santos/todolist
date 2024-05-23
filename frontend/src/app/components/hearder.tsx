import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/api";

export interface FieldsNewTask {
  name: string;
  value?: number;
  unit?: string;
}

interface HeaderProps {
  name: string;
  updateTaskList: () => void;
}

export const Header: FC<HeaderProps> = ({ updateTaskList, name }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldsNewTask>();

  const handleNewTask = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSubmitHandler = async (data: FieldsNewTask) => {
    try {
      const response = await api.post(`task/create/`, {
        name: data.name,
        value: data.value,
        unit: data.unit,
      });
      if (response.status === 200) {
        setIsModalOpen(false);
        updateTaskList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-gray-700 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="ml-10 text-lg font-semibold">Welcome {name}</span>
      </div>
      <div className="flex items-center">
        <button
          className="mr-4 text-lg font-semibold bg-gray-700 text-white py-2 px-2 rounded"
          onClick={handleNewTask}
        >
          New Task
        </button>
        <div className="h-8 w-px bg-white opacity-25 mr-4"></div>
        <button className="text-lg font-semibold bg-gray-700 text-white py-2 px-2 rounded">
          Logout
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-black text-xl font-bold">Create a Task</h2>
              <button
                onClick={handleCloseModal}
                className="text-red-500 text-xl hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-black">
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
                <label htmlFor="value" className="text-black block">
                  Value
                </label>
                <input
                  type="number"
                  id="value"
                  style={{ color: "black" }}
                  {...register("value", {
                    setValueAs: (v) => (v === "" ? undefined : v),
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                    errors.value ? "border-red-500" : ""
                  }`}
                />
                {errors.value && (
                  <p className="text-sm text-red-500">{errors.value.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="unit" className="block text-black">
                  Unit
                </label>
                <input
                  type="text"
                  id="unit"
                  style={{ color: "black" }}
                  {...register("unit", {
                    setValueAs: (v) => (v === "" ? undefined : v),
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                    errors.unit ? "border-red-500" : ""
                  }`}
                />
                {errors.unit && (
                  <p className="text-sm text-red-500">{errors.unit.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
