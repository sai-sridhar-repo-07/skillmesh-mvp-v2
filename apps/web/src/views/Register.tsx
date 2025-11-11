import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with register API
    setTimeout(() => {
      navigate("/auth/login");
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
          className="text-2xl font-bold text-center mb-1"
          style={{ color: "var(--color-primary)" }}
        >
          Create Account 🚀
        </h1>
        <p className="text-center text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
          Join SkillMesh and start sharing your skills
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-medium mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              value={form.username}
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
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "var(--color-text-secondary)" }}>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
