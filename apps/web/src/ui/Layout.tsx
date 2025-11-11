import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  const navLinks = [
    { name: "Discover", path: "/discover" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  // Hide footer on auth pages
  const hideFooter = location.pathname.startsWith("/auth") || !isLoggedIn;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl"
            style={{ color: "var(--color-primary)" }}
          >
            <img src="/logo.png" alt="SkillMesh" className="w-8 h-8 object-contain rounded-md" />
            SkillMesh
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {isLoggedIn &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-medium transition-all"
                  style={{
                    color: "var(--color-text-secondary)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-secondary)")
                  }
                >
                  {link.name}
                </Link>
              ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 ml-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition-all duration-300 hover:rotate-180"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-primary)",
              }}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden md:inline-block px-4 py-2 font-medium rounded-xl transition-all duration-300 shadow-sm"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-secondary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-primary)")
                }
              >
                Logout
              </button>
            ) : (
              <div className="hidden md:flex gap-3">
                {/* LOGIN BUTTON */}
                <Link
                  to="/auth/login"
                  className="px-4 py-2 rounded-xl font-medium border transition-all duration-300 hover:shadow-sm"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-primary)";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-surface)";
                    e.currentTarget.style.color = "var(--color-primary)";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 font-medium rounded-xl text-white transition-all duration-300"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--color-secondary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--color-primary)")
                  }
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-md border"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-primary)",
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div
            className="md:hidden border-t transition-colors duration-300"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <nav className="flex flex-col px-6 py-3 space-y-3">
              {isLoggedIn &&
                navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="font-medium transition-colors"
                    style={{
                      color: "var(--color-text-secondary)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-text-secondary)")
                    }
                  >
                    {link.name}
                  </Link>
                ))}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="font-medium text-left transition-all"
                  style={{ color: "var(--color-primary)" }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 font-medium rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--color-primary)",
                      border: "1px solid var(--color-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-primary)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--color-primary)";
                    }}
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content (flex-1 ensures footer stays at bottom) */}
      <main className="flex-1 flex flex-col justify-center">
        <Outlet />
      </main>

      {/* Footer (visible only after login) */}
      {!hideFooter && (
        <footer
          className="border-t py-6 text-sm text-center transition-colors duration-300"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          © 2025 SkillMesh —{" "}
          <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
            Learn. Share. Grow.
          </span>
        </footer>
      )}
    </div>
  );
}
