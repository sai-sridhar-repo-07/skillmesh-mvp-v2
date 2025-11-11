import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with API
    setTimeout(() => {
      localStorage.setItem("accessToken", "mockToken");
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      className="flex items-center justify-center h-[calc(100vh-80px)] overflow-hidden px-2 transition-colors duration-300"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text-primary)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl shadow-soft sm:p-10 transition-all duration-300"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h1
          className="text-2xl font-bold text-center mb-2"
          style={{ color: "var(--color-primary)" }}
        >
          Welcome Back 👋
        </h1>
        <p className="text-center text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Sign in to your SkillMesh account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={form.email}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-xl border focus:outline-none transition-all duration-300"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2.5 rounded-xl border focus:outline-none transition-all duration-300"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-medium rounded-xl text-white transition-all duration-300 shadow-sm"
            style={{
              backgroundColor: "var(--color-primary)",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "var(--color-text-secondary)" }}>
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
