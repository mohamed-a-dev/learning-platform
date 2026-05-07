type Props = {
  title: string;
  value: number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl duration-200">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}