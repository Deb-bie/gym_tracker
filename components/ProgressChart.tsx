import { Exercise } from "../shared/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProgressChartProps {
  exercises: Exercise[];
}

export function ProgressChart({ exercises }: ProgressChartProps) {
  const chartData = exercises
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((exercise, index) => ({
      workout: index + 1,
      weight: exercise.weight,
      volume: exercise.weight * exercise.sets * exercise.reps,
      date: new Date(exercise.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: exercise.date,
    }));

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No data to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Weight Progression</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              fontSize={12}
              tick={{ fontSize: 12 }}
              label={{
                value: "Weight (kg)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `Date: ${payload[0].payload.fullDate}`;
                }
                return label;
              }}
              formatter={(value: number, name: string) => [
                `${value} kg`,
                name === "weight" ? "Weight" : "Volume",
              ]}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="font-medium mb-3">Volume Progression</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              fontSize={12}
              tick={{ fontSize: 12 }}
              label={{
                value: "Volume (kg)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `Date: ${payload[0].payload.fullDate}`;
                }
                return label;
              }}
              formatter={(value: number) => [`${value} kg`, "Volume"]}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
