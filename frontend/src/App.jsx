import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext.jsx";
import Hero from "./components/Hero.jsx";
import LeadCaptureForm from "./components/LeadCaptureForm.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-lg font-bold tracking-tight text-white">
            LeadDesk<span className="text-neutral-500">.</span>
          </span>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-neutral-400 transition-colors hover:text-white">Features</a>
            <a href="#pricing" className="text-sm text-neutral-400 transition-colors hover:text-white">Pricing</a>
            <a href="#about" className="text-sm text-neutral-400 transition-colors hover:text-white">About</a>
          </nav>
          <Link
            to="/admin"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <Hero />
        <section className="relative z-10 px-4 pb-24">
          <LeadCaptureForm />
        </section>
      </main>

      <footer className="border-t border-neutral-800 px-8 py-8 text-center text-sm text-neutral-500">
        LeadDesk Mini &copy; {new Date().getFullYear()} · Built for Digital Heroes Training Task
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
