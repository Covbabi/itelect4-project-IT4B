import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const isAuthenticated = useAuthStore((state) => Boolean(state.token));
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    login(trimmedEmail, fullName.trim());
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Lost & Found
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            Sign in
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
              Full Name (optional)
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan dela Cruz"
              className="w-full rounded border border-gray-300 p-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded border border-gray-300 p-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={!email.trim()}
            className="mt-4 w-full rounded bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;