"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/protected/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          const data = await res.json();
          setUser(data.user);

          // Only fetch users if current user is admin
          if (data.user.role === "ADMIN") {
            const resUsers = await fetch("/api/users");
            const usersData = await resUsers.json();
            setUsers(usersData);
          }
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

return (
  <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
    {/* Greeting Section */}
    <h1 className="text-3xl font-semibold">
      Hello, <span className="text-blue-500">{user.name}</span>!
    </h1>
   

    {/* Admin Section */}
    {user.role === "ADMIN" && (
      <div className="w-full max-w-3xl mt-6">
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{u.id}</td>
                <td className="py-2 px-4">{u.name}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded mt-4"
    >
      Sign Out
    </button>
  </div>
);
}

