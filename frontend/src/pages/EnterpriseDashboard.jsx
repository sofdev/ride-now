import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Users, FileText, Copy, CheckCheck, Loader2,
  TrendingUp, Car, UserPlus, Trash2, Crown, LogOut,
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../hooks/useCompany';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

/* ─── Génération de facture HTML (print) ────────────────────────── */
function printInvoice(company, bookings, month) {
  const filtered = bookings.filter(b => {
    const d = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === month;
  });
  const total = filtered.reduce((s, b) => s + (b.price || 0), 0);
  const [year, mon] = month.split('-');
  const monthLabel = new Date(year, mon - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const rows = filtered.map(b => `
    <tr>
      <td>${b.reference || '—'}</td>
      <td>${b.userName || '—'}</td>
      <td>${b.date || '—'} ${b.time || ''}</td>
      <td>${b.pickup || '—'}</td>
      <td>${b.dropoff || '—'}</td>
      <td>${b.vehicleType || '—'}</td>
      <td style="text-align:right;font-weight:700">${b.price || 0}€</td>
    </tr>`).join('');

  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Facture ${monthLabel} — ${company.name}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;padding:40px;color:#1e293b;font-size:13px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid #0066FF}
      .logo{font-size:28px;font-weight:900;color:#0066FF}.logo span{color:#1e293b}
      .company-info{text-align:right}
      h1{font-size:22px;margin-bottom:24px}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px}
      .meta-block{background:#f8fafc;padding:16px;border-radius:8px}
      .meta-block h3{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
      table{width:100%;border-collapse:collapse;margin-bottom:24px}
      th{background:#f1f5f9;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b}
      td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:12px}
      tr:last-child td{border-bottom:none}
      .total{text-align:right;margin-top:8px}
      .total-amount{font-size:24px;font-weight:900;color:#0066FF}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center}
      @media print{body{padding:20px}}
    </style></head><body>
    <div class="header">
      <div class="logo">Ride<span>Now</span></div>
      <div class="company-info">
        <p style="font-size:11px;color:#64748b">Transport VTC Premium</p>
      </div>
    </div>
    <h1>Facture — ${monthLabel}</h1>
    <div class="meta">
      <div class="meta-block">
        <h3>Facturé à</h3>
        <p style="font-weight:700;margin-bottom:4px">${company.name}</p>
        ${company.siret ? `<p>SIRET : ${company.siret}</p>` : ''}
        ${company.vatNumber ? `<p>TVA : ${company.vatNumber}</p>` : ''}
        <p style="margin-top:4px;color:#64748b">${company.billingAddress || ''}</p>
      </div>
      <div class="meta-block">
        <h3>Détails</h3>
        <p>Période : ${monthLabel}</p>
        <p>Nombre de trajets : ${filtered.length}</p>
        <p>Email : ${company.billingEmail || ''}</p>
      </div>
    </div>
    <table>
      <thead><tr>
        <th>Référence</th><th>Collaborateur</th><th>Date</th>
        <th>Départ</th><th>Destination</th><th>Véhicule</th><th>Montant</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="total">
      <p style="font-size:13px;color:#64748b;margin-bottom:4px">Total HT (TVA non applicable — art. 293 B du CGI)</p>
      <p class="total-amount">${total.toFixed(2)}€</p>
    </div>
    <div class="footer">RideNow — Transport VTC Premium · contact@ridenow.fr · ${import.meta.env.VITE_PHONE_DISPLAY || ''}</div>
    <script>window.onload=()=>{window.print()}</script>
  </body></html>`);
  w.document.close();
}

/* ─── Tabs ──────────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',  label: 'Vue d\'ensemble', icon: BarChart3 },
  { id: 'bookings',  label: 'Trajets',         icon: Car },
  { id: 'team',      label: 'Équipe',          icon: Users },
  { id: 'invoices',  label: 'Factures',        icon: FileText },
];

const VEHICLE_LABELS = { standard: 'Standard', premium: 'Premium', van: 'Van' };

export default function EnterpriseDashboard() {
  const { currentUser } = useAuth();
  const { company, companyRole, loading: companyLoading } = useCompany();
  const navigate = useNavigate();

  const [tab,      setTab]      = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [members,  setMembers]  = useState([]);
  const [copied,   setCopied]   = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (companyLoading) return;
    if (!currentUser) { navigate('/'); return; }
    if (!company)      { navigate('/entreprise'); return; }

    const load = async () => {
      const [{ data: bookingsData }, { data: membersData }] = await Promise.all([
        api.get(`/api/user-bookings/company/${company.id}`),
        api.get(`/api/companies/${company.id}/members`),
      ]);
      setBookings(bookingsData);
      setMembers(membersData);
      setDataLoading(false);
    };
    load();
  }, [company, companyLoading, currentUser, navigate]);

  const copyCode = () => {
    navigator.clipboard.writeText(company?.inviteCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeMember = async (uid) => {
    if (uid === company?.adminUid) return;
    await api.delete(`/api/companies/${company.id}/members/${uid}`);
    setMembers(m => m.filter(x => x.uid !== uid));
  };

  /* ── Statistiques ── */
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthBookings = bookings.filter(b => {
    const d = new Date(b.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === thisMonth;
  });
  const monthSpend = monthBookings.reduce((s, b) => s + (b.price || 0), 0);
  const totalSpend = bookings.reduce((s, b) => s + (b.price || 0), 0);

  /* ── Mois disponibles pour les factures ── */
  const months = [...new Set(bookings.map(b => {
    const d = new Date(b.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }))].sort().reverse();

  if (companyLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <>
      <SEO title={`Dashboard — ${company?.name}`} canonical="/entreprise/dashboard" />

      <div className="min-h-screen bg-slate-50 pt-20">
        {/* Header dashboard */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Compte entreprise</p>
                <h1 className="text-2xl font-black text-slate-900">{company?.name}</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2">
                  <span className="text-xs text-brand-500 font-bold">Code invitation :</span>
                  <span className="font-black text-brand-600 tracking-widest text-sm">{company?.inviteCode}</span>
                  <button onClick={copyCode} className="text-brand-400 hover:text-brand-600 transition-colors ml-1">
                    {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-6 -mb-px overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    tab === id
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Vue d'ensemble ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Trajets ce mois', value: monthBookings.length, sub: 'réservations', color: 'text-brand-600' },
                  { label: 'Dépenses ce mois', value: `${monthSpend}€`, sub: 'toutes catégories', color: 'text-brand-600' },
                  { label: 'Total trajets', value: bookings.length, sub: 'depuis le début', color: 'text-slate-900' },
                  { label: 'Collaborateurs', value: members.length, sub: 'actifs', color: 'text-slate-900' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Derniers trajets */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-bold text-slate-900">Derniers trajets</h2>
                </div>
                {bookings.slice(0, 5).length === 0 ? (
                  <p className="p-8 text-center text-slate-400 text-sm">Aucun trajet pour le moment.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Réf.', 'Collaborateur', 'Trajet', 'Date', 'Montant'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-brand-600 font-bold">#{b.reference}</td>
                          <td className="px-5 py-3 text-slate-700">{b.userName}</td>
                          <td className="px-5 py-3 text-slate-500 max-w-[200px] truncate">{b.pickup} → {b.dropoff}</td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{b.date} {b.time}</td>
                          <td className="px-5 py-3 font-black text-slate-900">{b.price}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── Trajets ── */}
          {tab === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Tous les trajets ({bookings.length})</h2>
                <span className="text-sm text-slate-400">Total : <strong className="text-slate-900">{totalSpend}€</strong></span>
              </div>
              {bookings.length === 0 ? (
                <p className="p-12 text-center text-slate-400 text-sm">Aucun trajet enregistré.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Réf.', 'Collaborateur', 'Départ', 'Destination', 'Véhicule', 'Date', 'Montant'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-brand-600 font-bold">#{b.reference}</td>
                          <td className="px-5 py-3 text-slate-700 whitespace-nowrap">{b.userName}</td>
                          <td className="px-5 py-3 text-slate-500 max-w-[150px] truncate">{b.pickup}</td>
                          <td className="px-5 py-3 text-slate-500 max-w-[150px] truncate">{b.dropoff}</td>
                          <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{VEHICLE_LABELS[b.vehicleType] || b.vehicleType}</td>
                          <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{b.date} {b.time}</td>
                          <td className="px-5 py-3 font-black text-slate-900">{b.price}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Équipe ── */}
          {tab === 'team' && (
            <div className="space-y-4">
              {/* Code invitation */}
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
                <h2 className="font-bold text-slate-900 mb-1">Code d'invitation</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Partagez ce code à vos collaborateurs. Ils entrent ce code lors de leur inscription pour rejoindre votre compte.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border-2 border-brand-300 rounded-xl px-4 py-3">
                    <p className="font-black text-brand-600 text-xl tracking-widest">{company?.inviteCode}</p>
                  </div>
                  <button onClick={copyCode}
                    className="btn-primary py-3 flex-shrink-0">
                    {copied ? <><CheckCheck size={16} /> Copié !</> : <><Copy size={16} /> Copier</>}
                  </button>
                </div>
              </div>

              {/* Liste membres */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-bold text-slate-900">Collaborateurs ({members.length})</h2>
                </div>
                <ul className="divide-y divide-gray-50">
                  {members.map(m => (
                    <li key={m.uid} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-sm">
                          {(m.displayName || m.email || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{m.displayName || '—'}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {m.role === 'admin'
                          ? <span className="flex items-center gap-1 badge bg-brand-100 text-brand-600 text-xs"><Crown size={10} /> Admin</span>
                          : <span className="badge bg-slate-100 text-slate-600 text-xs">Employé</span>}
                        {companyRole === 'admin' && m.uid !== currentUser?.uid && (
                          <button onClick={() => removeMember(m.uid)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── Factures ── */}
          {tab === 'invoices' && (
            <div className="space-y-3">
              {months.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                  <FileText size={40} className="text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm">Aucune facture disponible pour le moment.</p>
                </div>
              ) : months.map(month => {
                const mb = bookings.filter(b => {
                  const d = new Date(b.createdAt);
                  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === month;
                });
                const total = mb.reduce((s, b) => s + (b.price || 0), 0);
                const [y, m] = month.split('-');
                const label = new Date(y, m - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

                return (
                  <div key={month} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 capitalize">{label}</p>
                      <p className="text-sm text-slate-400">{mb.length} trajet{mb.length > 1 ? 's' : ''} · <strong className="text-slate-700">{total}€</strong></p>
                    </div>
                    <button
                      onClick={() => printInvoice(company, bookings, month)}
                      className="btn-secondary text-sm py-2">
                      <FileText size={15} /> Télécharger PDF
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}
