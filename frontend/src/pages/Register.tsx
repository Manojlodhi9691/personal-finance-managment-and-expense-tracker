import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch {
      setError("Could not create account.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="text-4xl">💰</div>

          <h1 className="mt-3 text-3xl font-bold">
            Create account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start managing your finances
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-slate-900"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}