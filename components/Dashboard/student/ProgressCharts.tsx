"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, } from "recharts";

type CourseProgress = {
    name: string;
    progress: number;
    fill: string;
};

type Props = {
    data: CourseProgress[];
};

export default function ProgressChart({ data }: Props) {

    if (data.length === 0)
        return (
            <div className="h-100 md:w-3/5 bg-white rounded-xl shadow-md p-4 flex items-center justify-center text-gray-500">
                No course progress yet
            </div>
        );

    return (
        <div className="h-100 md:w-3/5 bg-white rounded-xl shadow-md hover:shadow-xl p-4 duration-200">
            <h2 className="mb-4 text-xl font-semibold">
                Course Progress
            </h2>

            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 20, right: 50 }}
                >
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip
                        formatter={(value) => {
                            if (value == null) return "";
                            return `${value}%`;
                        }}
                    />
                    <Bar
                        dataKey="progress"
                        barSize={18}
                        radius={[0, 8, 8, 0]}
                    >
                        <LabelList
                            dataKey="progress"
                            position="right"
                            formatter={(value) =>
                                typeof value === "number" ? `${value}%` : ""
                            }
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}