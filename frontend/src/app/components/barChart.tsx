import { registerables, Chart } from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../api/api";
import { Task } from "../dashboard/page";

Chart.register(...registerables);

interface History {
  id: string;
  taskId: string;
  date: Date;
  value?: string;
}

interface BarChartProps {
  task: Task;
  baseDate: Date;
}

const BarChart: React.FC<BarChartProps> = ({ task, baseDate }) => {
  const [value, setValue] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const formattedLabels = getLastWeek(baseDate).map((date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  });

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Done",
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
        const response = await api.get(`task/history/${task.id}`);
        const history: History[] = response.data.map((his: History) => ({
          ...his,
          date: new Date(his.date),
        }));
        const value = getLastWeek(baseDate).map((date) => {
          return history.find(
            (his) =>
              his.date.getDate() == date.getDate() &&
              his.date.getMonth() == date.getMonth()
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

function getLastWeek(baseDate: Date): Date[] {
  const dates: Date[] = [];
  const copy = new Date(baseDate);
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(copy);
    newDate.setDate(copy.getDate() - i);
    dates.push(newDate);
  }
  dates.reverse();
  return dates;
}

export default BarChart;
