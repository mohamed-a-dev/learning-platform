import { getStudentsAction } from "@/actions/instructor-courses-actions";

type Student = {
  id: string;
  name: string;
  email: string;
};


export default async function StudentsTable() {
  const { success, message } = await getStudentsAction();
  const students = success ? message : [];

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <p className="text-2xl font-semibold text-gray-700">
          No students found
        </p>
      </div>
    );
  }

  return (
    <section className="p-5 space-y-5 h-full">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">Students</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          students.map((student: Student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">
                {student.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {student.email}
              </p>
            </div>
          ))
        }
      </div>
    </section >
  );
}