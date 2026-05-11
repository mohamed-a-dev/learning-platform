"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CourseEnrollment = {
  name: string;
  enrollments: number;
  fill?: string;
};

type Props = {
  data: CourseEnrollment[];
};

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
  "#EC4899",
];

export default function EnrollmentsPieChart({ data }: Props) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="overflow-scroll h-90 md:w-full bg-white rounded-xl shadow-md hover:shadow-xl p-4 duration-200">
      <h2 className="font-semibold mb-4">Course Enrollments Distribution</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="enrollments"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          />

          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={100}
            wrapperStyle={{ paddingTop: 30 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}