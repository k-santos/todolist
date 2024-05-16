import { Chart, registerables } from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../api/api";
import { Task } from "../dashboard/page";

Chart.register(...registerables);

interface LineChartProps {
  task: Task;
}

interface Historic {
  id: string;
  taskId: string;
  created_at: Date;
  value: number;
}

const LineChart: React.FC<LineChartProps> = ({ task }) => {
  const [value, setValue] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const formattedLabels = getLastWeek().map((date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  });
  const target = parseInt(task.complement.split(" ")[0]);
  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Meu desempenho",
        data: value,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Meta",
        data: Array(formattedLabels.length).fill(target),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        borderDash: [5, 5],
        tension: 0,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
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
          const hist = historic.find(
            (his) =>
              his.created_at.getDate() == date.getDate() &&
              his.created_at.getMonth() == date.getMonth()
          );
          if (hist) {
            return hist.value;
          }
          return 0;
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
      <Line data={chartData} options={options} />
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

export default LineChart;
