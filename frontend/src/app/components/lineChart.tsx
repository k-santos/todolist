import { Chart, registerables } from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../api/api";
import { Task } from "../dashboard/page";

Chart.register(...registerables);

interface LineChartProps {
  task: Task;
  baseDate: Date;
}

interface History {
  id: string;
  taskId: string;
  date: Date;
  value: number;
}

const LineChart: React.FC<LineChartProps> = ({ task, baseDate }) => {
  const [value, setValue] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const formattedLabels = getLastWeek(baseDate).map((date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  });
  const target = parseInt(task.complement.split(" ")[0]);
  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        label: "My progress",
        data: value,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Goal",
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
        const response = await api.get(`task/history/${task.id}`);
        const historic: History[] = response.data.map((his: History) => ({
          ...his,
          date: new Date(his.date),
        }));
        const value = getLastWeek(baseDate).map((date) => {
          const hist = historic.find(
            (his) =>
              his.date.getDate() == date.getDate() &&
              his.date.getMonth() == date.getMonth()
          );
          if (hist) {
            return hist.value;
          }
          return 0;
        });
        setValue(value);
      } catch (error) {
        console.error("Error find history:", error);
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

export default LineChart;
