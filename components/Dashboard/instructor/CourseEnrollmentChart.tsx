"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "React", enrollments: 120 },
  { name: "Next.js", enrollments: 90 },
  { name: "Node", enrollments: 70 },
  { name: "Mongo", enrollments: 50 },
  { name: "Prisma", enrollments: 65 },
];

export default function EnrollmentsBarChart() {
  return (
    <div className="h-80 md:flex-1 bg-white rounded-xl shadow-md hover:shadow-xl p-4 duration-200">
      <h2 className="font-semibold tracking-normal mb-4">Course Enrollments</h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="enrollments" fill="#000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}