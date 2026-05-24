import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const UserCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Badge ─────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Aktif:    { bg: "#e6f9f0", color: "#1a9e5c", label: "Aktif" },
    Nonaktif: { bg: "#fdecea", color: "#d93025", label: "Nonaktif" },
    Pending:  { bg: "#fff8e1", color: "#e0a800", label: "Pending" },
  };
  const cfg = map[status] ?? map["Aktif"];
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.3px",
      backgroundColor: cfg.bg,
      color: cfg.color,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {cfg.label}
    </span>
  );
};

// ─── InfoRow ───────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, text }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "5px 0",
    color: "#555",
    fontSize: 13.5,
    fontFamily: "'DM Sans', sans-serif",
  }}>
    <span style={{ color: "#888", flexShrink: 0, display: "flex", alignItems: "center" }}>{icon}</span>
    <span style={{ lineHeight: 1.4 }}>{text}</span>
  </div>
);

// ─── CompanyCard ───────────────────────────────────────────────────────────────
/**
 * @param {object}   props
 * @param {string}   props.companyName       - Nama perusahaan
 * @param {string}   props.address           - Alamat lengkap
 * @param {string}   props.phone             - Nomor telepon
 * @param {string}   props.email             - Alamat email
 * @param {string}   props.petugasMapping    - Nama petugas mapping
 * @param {"Aktif"|"Nonaktif"|"Pending"} props.status - Status perusahaan
 * @param {function} props.onLihatDetail     - Callback tombol Lihat Detail
 * @param {function} props.onEdit            - Callback tombol Edit
 */
const CompanyCard = ({
  companyName    = "PT Batam Bintan Telekomunikasi",
  address        = "Jl. Engku Putri No. 45, Batam Centre",
  phone          = "+62 778 123456",
  email          = "contact@bbt.co.id",
  petugasMapping = "Ahmad Rifai",
  status         = "Aktif",
  onLihatDetail  = () => {},
  onEdit         = () => {},
}) => {
  const [hoverDetail, setHoverDetail] = useState(false);
  const [hoverEdit,   setHoverEdit]   = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        .cc-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .cc-card:hover { box-shadow: 0 8px 32px rgba(30,80,200,0.13); transform: translateY(-2px); }
        .cc-btn-detail { transition: background 0.15s, box-shadow 0.15s; }
        .cc-btn-edit   { transition: background 0.15s, color 0.15s; }
      `}</style>

      <div className="cc-card" style={{
        width: 320,
        background: "#ffffff",
        borderRadius: 18,
        boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
        padding: "22px 22px 18px",
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: "border-box",
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
          {/* Avatar */}
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: "#EEF4FF",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#3B7BF8", flexShrink: 0,
          }}>
            <BuildingIcon />
          </div>

          {/* Name + Status */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <p style={{
                margin: 0,
                fontFamily: "'DM Serif Display', serif",
                fontSize: 16,
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.3,
              }}>
                {companyName}
              </p>
              <StatusBadge status={status} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 5, color: "#888", fontSize: 12.5 }}>
              <MapPinIcon />
              <span style={{ lineHeight: 1.4 }}>{address}</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 14 }} />

        {/* ── Info rows ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
          <InfoRow icon={<PhoneIcon />}    text={phone} />
          <InfoRow icon={<MailIcon />}     text={email} />
          <InfoRow icon={<UserCheckIcon />} text={`Petugas Mapping: ${petugasMapping}`} />
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="cc-btn-detail"
            onClick={onLihatDetail}
            onMouseEnter={() => setHoverDetail(true)}
            onMouseLeave={() => setHoverDetail(false)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              background: hoverDetail
                ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                : "linear-gradient(135deg, #3B7BF8, #2563eb)",
              color: "#fff",
              boxShadow: hoverDetail
                ? "0 4px 16px rgba(37,99,235,0.45)"
                : "0 2px 8px rgba(37,99,235,0.30)",
            }}
          >
            Lihat Detail
          </button>

          <button
            className="cc-btn-edit"
            onClick={onEdit}
            onMouseEnter={() => setHoverEdit(true)}
            onMouseLeave={() => setHoverEdit(false)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              background: hoverEdit ? "#f5f7ff" : "#fafafa",
              color: hoverEdit ? "#2563eb" : "#555",
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Demo ──────────────────────────────────────────────────────────────────────
export default function App() {
  const cards = [
    {
      companyName: "PT Batam Bintan Telekomunikasi",
      address: "Jl. Engku Putri No. 45, Batam Centre",
      phone: "+62 778 123456",
      email: "contact@bbt.co.id",
      petugasMapping: "Ahmad Rifai",
      status: "Aktif",
    },
    {
      companyName: "CV Nusa Teknindo",
      address: "Jl. Ahmad Yani No. 12, Nagoya",
      phone: "+62 778 654321",
      email: "info@nusatek.id",
      petugasMapping: "Siti Rahayu",
      status: "Pending",
    },
    {
      companyName: "PT Batamindo Solutions",
      address: "Jl. Raden Patah No. 88, Sei Beduk",
      phone: "+62 778 987654",
      email: "hello@batamindo.co.id",
      petugasMapping: "Budi Santoso",
      status: "Nonaktif",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 24,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
        {cards.map((c, i) => (
          <CompanyCard
            key={i}
            {...c}
            onLihatDetail={() => alert(`Lihat Detail: ${c.companyName}`)}
            onEdit={() => alert(`Edit: ${c.companyName}`)}
          />
        ))}
      </div>
    </div>
  );
}