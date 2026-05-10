"use client";

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Label,
} from "recharts";

type DataItem = {
    name: string;
    value: number;
};

type Props = {
    data: DataItem[];
};

const COLORS = ["#22c55e", "#ef4444"];

export default function RemainingLessonsChart({ data }: Props) {
    const coloredData = data.map((item, index) => ({
        ...item,
        fill: COLORS[index],
    }));

    const total = data.reduce((acc, cur) => acc + cur.value, 0);

    if (data.length === 0)
        return (
            <div className="h-100 md:flex-1 bg-white rounded-xl shadow-md p-4 flex items-center justify-center text-gray-500">
                No lessons progress yet
            </div>
        );

    return (
        <div className="h-100 md:flex-1 bg-white rounded-xl shadow-md hover:shadow-xl p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">
                Lessons Progress
            </h2>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={coloredData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={120}
                            paddingAngle={6}
                        >
                            <Label
                                value={total}
                                position="center"
                                style={{
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                }}
                            />
                        </Pie>

                        <Tooltip />

                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}