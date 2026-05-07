"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", students: 12 },
  { name: "Tue", students: 19 },
  { name: "Wed", students: 25 },
  { name: "Thu", students: 18 },
  { name: "Fri", students: 32 },
  { name: "Sat", students: 40 },
  { name: "Sun", students: 28 },
];

export default function StudentsLineChart() {
  return (
    <div className="h-80 md:flex-1 bg-white shadow-md hover:shadow-xl rounded-xl p-4 duration-200">
      <h2 className="font-semibold tracking-normal mb-4">Students Growth</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="students" stroke="#000" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}