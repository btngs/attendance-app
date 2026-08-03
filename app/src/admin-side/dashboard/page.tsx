import SummaryCard from "@/app/components/SummaryCard";
import Navbar from "../../components/Navbar";
import AttendanceTable from "../../components/AttendanceTable";

export default function DashboardPage() {
  return(
    <main style={{ backgroundColor: "#fefefe", minHeight: "100vh",  overflowX: "hidden" }}>
      <Navbar />

      <section style={{ 
        padding: "10px 40px",
        maxWidth: "1200px",
        margin: "0 auto"
        }}>
        <h1 style={{ 
          color: "#e8a838" ,
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "10px"
         }}>
          Absensi hari ini
         </h1>

         <div style={{ 
          display: "flex",
          gap: "15px",
          marginBottom: "40px"
         }}>
          <SummaryCard 
            icon="👥"
            count={5}
            label="Hadir"
            bgColor="rgba(181, 225, 139, 0.3)"
            iconBgColor="#ffffff"
          />

          <SummaryCard
            icon="✉️"
            count={5}
            label="Izin"
            bgColor="rgba(0, 136, 255, 0.3)"
            iconBgColor="#ffffff"
          />

          <SummaryCard
            icon="📋"
            count={5}
            label="Sakit"
            bgColor="rgba(255, 204, 0, 0.3)"
            iconBgColor="#ffffff"
          />

          <SummaryCard
            icon="⛔"
            count={5}
            label="Tidak/belum hadir"
            bgColor="rgba(217, 0, 0, 0.3)"
            iconBgColor="#ffffff"
          />
         </div>

          <AttendanceTable />

          {/* Pagination */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          alignItems: "center", 
          gap: "8px",
          padding: "16px",
          borderTop: "1px solid #f0f0f0"
        }}>
          <button style={pageButtonStyle}>&lt;</button>
          <button style={{...pageButtonStyle, backgroundColor: "#e8a838", color: "white"}}>1</button>
          <button style={pageButtonStyle}>2</button>
          <button style={pageButtonStyle}>3</button>
          <button style={pageButtonStyle}>&gt;</button>
        </div>
      </section>
    </main>
  );
}

const pageButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  backgroundColor: "white",
  cursor: "pointer",
  fontSize: "14px"
};