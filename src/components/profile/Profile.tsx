'use client';
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();
  console.log(session?.user?.name);

  if (status === "loading") return <p>Loading...</p>;

  if (!session?.user) return <p>Please log in</p>;

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
