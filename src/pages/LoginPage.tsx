import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    login(name);
    navigate("/claims");
  };

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Login
      </h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
            Your Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Juan dela Cruz"
            className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. juan@example.com"
            className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={name.trim() === "" || email.trim() === ""}
          className="mt-4 w-full rounded bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;