import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../service/firebase";
import { useNavigate } from "react-router-dom";

// ── Icônes SVG inline (pas de dépendance externe) ──────────────
const Icon = {
  wifi:    () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>,
  users:   () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  ticket:  () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>,
  today:   () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  logout:  () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  search:  () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>,
  refresh: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  csv:     () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  pdf:     () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>,
  filter:  () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>,
  mac:     () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>,
  phone:   () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  chevron: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>,
};

const PAGE_SIZE = 10;

const Dashboard = () => {
  const [rows, setRows]           = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const user = auth.currentUser;

  // ── Chargement Firestore ──────────────────────────────────────
  const loadData = async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, "identites_arcep"), orderBy("date_connexion", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRows(data);
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── Filtres ───────────────────────────────────────────────────
  useEffect(() => {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week  = new Date(today); week.setDate(week.getDate() - 7);
    const month = new Date(today); month.setDate(1);

    const toDate = ts => ts?.toDate ? ts.toDate() : new Date(ts);

    let result = rows.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || [r.nom, r.prenom, r.telephone, r.ticket_code, r.adresse_mac, r.adresse_ip]
        .some(v => v && v.toLowerCase().includes(q));

      const d = toDate(r.date_connexion);
      const matchDate =
        dateFilter === "all"   ? true :
        dateFilter === "today" ? d >= today :
        dateFilter === "week"  ? d >= week  :
        dateFilter === "month" ? d >= month : true;

      return matchSearch && matchDate;
    });

    setFiltered(result);
    setPage(1);
  }, [search, dateFilter, rows]);

  // ── Stats ─────────────────────────────────────────────────────
  const toDate = ts => ts?.toDate ? ts.toDate() : new Date(ts);
  const now    = new Date();
  const today  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week   = new Date(today); week.setDate(week.getDate() - 7);

  const stats = {
    total:   rows.length,
    today:   rows.filter(r => toDate(r.date_connexion) >= today).length,
    week:    rows.filter(r => toDate(r.date_connexion) >= week).length,
    unique:  new Set(rows.map(r => r.telephone).filter(Boolean)).size,
  };

  // ── Pagination ────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Export CSV ────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Nom", "Prénom", "Téléphone", "Ticket", "MAC", "IP", "Date"];
    const lines   = filtered.map(r => {
      const d = toDate(r.date_connexion);
      return [r.nom, r.prenom, r.telephone, r.ticket_code, r.adresse_mac, r.adresse_ip,
        isNaN(d) ? "" : d.toLocaleString("fr-FR")
      ].map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",");
    });
    const blob = new Blob(["\ufeff" + [headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `aktwifi_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // ── Export PDF (print) ────────────────────────────────────────
  const exportPDF = () => window.print();

  // ── Déconnexion ───────────────────────────────────────────────
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // ── Formater date ─────────────────────────────────────────────
  const fmtDate = ts => {
    const d = toDate(ts);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
      + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── CONFIRM LOGOUT MODAL ─────────────────────────────── */}
      {logoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon.logout />
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-1">Déconnexion</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <Icon.wifi />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-none truncate">AKT WIFI</p>
              <p className="text-xs text-gray-400 leading-none mt-0.5 hidden sm:block">Dashboard Admin</p>
            </div>
          </div>

          {/* Badge abonnement */}
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">Abonnement Actif</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User email */}
            <span className="text-xs text-gray-500 hidden lg:block truncate max-w-[160px]">
              {user?.email}
            </span>
            <button onClick={() => setLogoutConfirm(true)}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl px-3 py-2 text-xs font-semibold transition">
              <Icon.logout />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STAT CARDS ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total connexions", value: stats.total,  icon: <Icon.users />,  color: "blue",    bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100" },
            { label: "Aujourd'hui",       value: stats.today,  icon: <Icon.today />,  color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
            { label: "Cette semaine",     value: stats.week,   icon: <Icon.wifi />,   color: "violet",  bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100" },
            { label: "Utilisateurs uniq.", value: stats.unique, icon: <Icon.ticket />, color: "amber",   bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100" },
          ].map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl border ${s.border} p-4 sm:p-5 shadow-sm`}>
              <div className={`w-9 h-9 ${s.bg} ${s.text} rounded-xl flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${s.text}`}>
                {loading ? <span className="animate-pulse text-gray-300">—</span> : s.value}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── TABLE CARD ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">

              {/* Titre + refresh */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h2 className="font-bold text-gray-800 text-base truncate">Historique des connexions</h2>
                {lastRefresh && (
                  <span className="text-xs text-gray-400 hidden md:inline whitespace-nowrap">
                    · {lastRefresh.toLocaleTimeString("fr-FR")}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={loadData}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl px-3 py-2 text-xs font-medium transition">
                  <Icon.refresh /><span className="hidden sm:inline">Actualiser</span>
                </button>
                <button onClick={exportCSV}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-3 py-2 text-xs font-semibold transition">
                  <Icon.csv /> CSV
                </button>
                <button onClick={exportPDF}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl px-3 py-2 text-xs font-semibold transition">
                  <Icon.pdf /> PDF
                </button>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon.search />
                </span>
                <input
                  type="text"
                  placeholder="Rechercher nom, téléphone, ticket, MAC..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              {/* Date filter */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon.filter />
                </span>
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Icon.chevron />
                </span>
              </div>
            </div>

            {/* Résultats count */}
            <p className="text-xs text-gray-400">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* ── TABLE desktop ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-gray-400 text-sm">Chargement des données…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-4xl">🔍</p>
              <p className="text-gray-500 text-sm font-medium">Aucun résultat</p>
              <p className="text-gray-400 text-xs">Modifiez vos critères de recherche</p>
            </div>
          ) : (
            <>
              {/* Table — visible md+ */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom & Prénom</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Heure</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Adresse MAC</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((r, i) => (
                      <tr key={r.id} className="hover:bg-blue-50/40 transition group">
                        <td className="px-5 py-4 text-slate-400 text-xs font-mono">
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(r.nom?.[0] || "?").toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{r.nom} {r.prenom}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <a href={`tel:${r.telephone}`} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 transition">
                            <Icon.phone />
                            {r.telephone || "—"}
                          </a>
                        </td>
                        <td className="px-5 py-4 text-gray-600 text-xs leading-relaxed">
                          {fmtDate(r.date_connexion)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center bg-slate-100 text-slate-700 text-xs font-mono font-semibold rounded-lg px-2.5 py-1">
                            {r.ticket_code || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1.5 text-gray-500 text-xs font-mono">
                            <Icon.mac />
                            {r.adresse_mac || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs font-mono">
                          {r.adresse_ip || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards — mobile uniquement */}
              <div className="md:hidden divide-y divide-slate-100">
                {paginated.map((r, i) => (
                  <div key={r.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {(r.nom?.[0] || "?").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{r.nom} {r.prenom}</p>
                          <a href={`tel:${r.telephone}`} className="text-blue-600 text-xs font-medium">
                            {r.telephone || "—"}
                          </a>
                        </div>
                      </div>
                      <span className="inline-flex bg-slate-100 text-slate-700 text-xs font-mono font-semibold rounded-lg px-2.5 py-1 flex-shrink-0">
                        {r.ticket_code || "—"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-gray-400 mb-0.5">Date & Heure</p>
                        <p className="text-gray-700 font-medium leading-snug">{fmtDate(r.date_connexion)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <p className="text-gray-400 mb-0.5">Adresse IP</p>
                        <p className="text-gray-700 font-mono font-medium">{r.adresse_ip || "—"}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl col-span-2 p-2.5">
                        <p className="text-gray-400 mb-0.5">Adresse MAC</p>
                        <p className="text-gray-700 font-mono font-medium">{r.adresse_mac || "—"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 gap-2 flex-wrap">
                  <p className="text-xs text-gray-400">
                    Page {page} sur {totalPages} · {filtered.length} entrées
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >← Préc</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                            page === p
                              ? "bg-blue-600 text-white shadow-sm"
                              : "border border-slate-200 text-gray-600 hover:bg-slate-50"
                          }`}>
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >Suiv →</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;