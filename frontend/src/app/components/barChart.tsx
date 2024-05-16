import { registerables, Chart } from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../api/api";
import { Task } from "../dashboard/page";

Chart.register(...registerables);

interface Historic {
  id: string;
  taskId: string;
  created_at: Date;
  value?: string;
}

interface BarChartProps {
  task: Task;
}

const BarChart: React.FC<BarChartProps> = ({ task }) => {
  const [value, setValue] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const formattedLabels = getLastWeek().map((date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  });

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Tarefa Feita",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: value,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    async function findHistoric() {
      try {
        const response = await api.get(`task/historic/${task.id}`);
        const historic: Historic[] = response.data.map((his: Historic) => ({
          ...his,
          created_at: new Date(his.created_at),
        }));
        const value = getLastWeek().map((date) => {
          return historic.find(
            (his) =>
              his.created_at.getDate() == date.getDate() &&
              his.created_at.getMonth() == date.getMonth()
          )
            ? 1
            : 0;
        });
        setValue(value);
      } catch (error) {
        console.error("Error find historic:", error);
      }
    }
    findHistoric();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-black text-xl font-bold mb-4">{task.name}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

function getLastWeek(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  dates.reverse();
  return dates;
}

export default BarChart;
