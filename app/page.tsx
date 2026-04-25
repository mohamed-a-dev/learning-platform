import requireAuth from "@/lib/auth/require-auth";

export default async function Home() {
  await requireAuth();
  
  return (
    <div>
      Home
    </div>
  );
}