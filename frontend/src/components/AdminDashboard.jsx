import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../lib/AuthContext.jsx";
import api from "../lib/api.js";

const statusOptions = ["New", "Contacted", "Closed"];

const budgetLabels = {
  under_1k: "Under $1k",
  "1k_5k": "$1k–$5k",
  "5k_20k": "$5k–$20k",
  "20k_plus": "$20k+",
};

const statusStyles = {
  New: "bg-accent/20 text-accent",
  Contacted: "bg-yellow-500/20 text-yellow-400",
  Closed: "bg-success/20 text-success",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const { token, logout } = useAuth();

  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;

      const { data } = await api.get("/api/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [token, page, debouncedSearch, status]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.patch(
        `/api/leads/${leadId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch {
      // silently fail — could add toast here
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-semibold text-text">
            Lead<span className="text-accent">Desk</span> Mini
          </span>
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Public Site
            </a>
            <button
              onClick={logout}
              className="text-sm text-text-muted transition-colors hover:text-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-semibold text-text">Leads</h1>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors sm:w-80"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors sm:w-48"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg
              className="h-8 w-8 animate-spin text-accent"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-text-muted">
            No leads found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface-raised">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Budget</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-3 text-text">{lead.name}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {lead.email}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-text-muted" title={lead.message}>
                        {lead.message}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {budgetLabels[lead.budget] || lead.budget}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(lead._id, e.target.value)
                          }
                          className={`cursor-pointer rounded-lg border-0 px-2 py-1 text-xs font-medium outline-none ${statusStyles[lead.status] || ""}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-text-muted">
              <span>
                {total} lead{total !== 1 && "s"} total
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:border-accent hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:border-accent hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-lg rounded-2xl border border-border bg-surface-raised p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1 text-text-muted transition-colors hover:text-text"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-text-muted">Name</p>
                <p className="text-text">{selectedLead.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-muted">Email</p>
                <p className="text-text">{selectedLead.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-muted">Budget</p>
                <p className="text-text">{budgetLabels[selectedLead.budget] || selectedLead.budget}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-muted">Status</p>
                <span className={`inline-block rounded-lg px-2 py-1 text-xs font-medium ${statusStyles[selectedLead.status] || ""}`}>
                  {selectedLead.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-text-muted">Message</p>
                <p className="whitespace-pre-wrap text-text">{selectedLead.message}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-muted">Submitted</p>
                <p className="text-text">{formatDate(selectedLead.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
