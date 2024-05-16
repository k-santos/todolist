"use client";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { FaChartBar, FaChartLine } from "react-icons/fa";
import BarChart from "../components/barChart";
import LineChart from "../components/lineChart";

export interface Task {
  id: string;
  name: string;
  complement: string;
  idCompletedToday?: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedChartTask, setSelectedChartTask] = useState<Task | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

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

  const handleChart = async (task: Task) => {
    setSelectedChartTask(task);
    setIsChartOpen(true);
  };

  const handleCheckboxChange = async (task: Task) => {
    if (task.idCompletedToday) {
      try {
        const response = await api.post("task/undo", {
          completedId: task.idCompletedToday,
        });
        if (response.status === 200) {
          const updatedTasks = tasks.map((currentTask) =>
            currentTask.id === task.id
              ? { ...currentTask, idCompletedToday: undefined }
              : currentTask
          );
          setTasks(updatedTasks);
        }
      } catch (error) {
        console.error("Error finish task:", error);
      }
      setSelectedTask(null);
      return;
    }
    if (task.complement) {
      setSelectedTask(task);
      setIsModalOpen(true);
    } else {
      try {
        const response = await api.post("task/finish", {
          taskId: task.id,
        });
        if (response.status === 200) {
          const updatedTasks = tasks.map((currentTask) =>
            currentTask.id === task.id
              ? { ...currentTask, idCompletedToday: response.data.id }
              : currentTask
          );
          setTasks(updatedTasks);
        }
      } catch (error) {
        console.error("Error finish task:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setInputValue("");
  };

  const handleCloseChartModal = () => {
    setIsChartOpen(false);
    setSelectedChartTask(null);
  };

  const handleFinalize = async () => {
    try {
      const response = await api.post("task/finish", {
        taskId: selectedTask?.id,
        value: inputValue,
      });
      if (response.status === 200) {
        const updatedTasks = tasks.map((currentTask) =>
          currentTask.id === selectedTask?.id
            ? { ...currentTask, idCompletedToday: response.data.id }
            : currentTask
        );
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error finish task:", error);
    }
    handleCloseModal();
  };

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
              checked={task.idCompletedToday != undefined}
              onChange={() => handleCheckboxChange(task)}
              className="mr-4 h-6 w-6 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <div className="flex items-center flex-grow">
              <div className="flex-grow">
                <h2 className="text-xl text-gray-500 font-semibold mr-2">
                  {task.name}
                </h2>
                <p className="text-gray-500">{task.complement}</p>
              </div>
              <button
                onClick={() => handleChart(task)}
                className="p-3 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              >
                {task.complement && <FaChartLine size={25} />}
                {!task.complement && <FaChartBar size={25} />}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Finalizar Tarefa</h2>
            <p className="mb-4">Tarefa: {selectedTask?.name}</p>
            <label className="block mb-2 text-gray-700">
              {`${selectedTask?.complement.split(" ")[1]}:`}
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalize}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {isChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-2/4 h-2/4">
            {selectedChartTask &&
              selectedChartTask?.complement == undefined && (
                <BarChart task={selectedChartTask} />
              )}
            {selectedChartTask && selectedChartTask?.complement && (
              <LineChart task={selectedChartTask} />
            )}

            <div className="flex justify-end">
              <button
                onClick={handleCloseChartModal}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
