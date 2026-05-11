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


type StudentGrowth = {
  name: string;
  progress: number;
  fill: string;
};

type Props = {
  data: StudentGrowth[];
};

export default function StudentsLineChart({ data }: Props) {
  return (
    <div className="h-90 md:w-full bg-white shadow-md hover:shadow-xl rounded-xl p-4 duration-200">
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