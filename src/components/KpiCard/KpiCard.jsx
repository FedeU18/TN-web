export default function KpiCard({ title, value, subtitle }) {
  return (
    <div style={{
      padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.08)",
      minWidth: 140, textAlign: "center"
    }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}