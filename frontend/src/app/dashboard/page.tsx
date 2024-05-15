"use client";
import React, { useEffect, useState } from "react";
import api from "../api/api";

interface Task {
  id: string;
  name: string;
  complement: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function findTasks() {
      try {
        const response = await api.get("task/find");
        const tasks = response.data.map((task: Task) => ({
          ...task,
        }));
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    findTasks();
  }, []);

  const handleCheckboxChange = (id: string) => {};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de tarefas</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center p-4 bg-white rounded shadow"
          >
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(task.id)}
              className="mr-4 h-6 w-6 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <div className="flex-grow">
              <h2 className="text-xl text-gray-500 font-semibold">
                {task.name}
              </h2>
              <p className="text-gray-500">{task.complement}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
