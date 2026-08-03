// Data statis (nanti diganti dengan data dari database)
const attendanceData = [
  {
    name: "Denias Raditya",
    division: "Divisi 1",
    position: "Staff",
    timeIn: "09:13:22",
    timeOut: "09:13:22",
    status: "hadir"
  },
  {
    name: "Denias Raditya",
    division: "Divisi 1",
    position: "Staff",
    timeIn: "-",
    timeOut: "-",
    status: "tidak hadir"
  },
  {
    name: "Denias Raditya",
    division: "Divisi 1",
    position: "Staff",
    timeIn: "-",
    timeOut: "-",
    status: "izin"
  },
  {
    name: "Denias Raditya",
    division: "Divisi 1",
    position: "Staff",
    timeIn: "09:13:22",
    timeOut: "-",
    status: "hadir"
  },
  {
    name: "Denias Raditya",
    division: "Divisi 1",
    position: "Staff",
    timeIn: "-",
    timeOut: "-",
    status: "tidak hadir"
  },
  {
    name: "Denias Raditya",
    division: "Divisi 1",
    position: "Staff",
    timeIn: "-",
    timeOut: "-",
    status: "cuti"
  },
];

// Fungsi untuk menentukan warna badge status
function getStatusStyle(status: string) {
  switch (status) {
    case "hadir":
      return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
    case "tidak hadir":
      return { backgroundColor: "#fde8e8", color: "#c62828" };
    case "izin":
    case "cuti":
      return { backgroundColor: "#e3f2fd", color: "#1565c0" };
    default:
      return { backgroundColor: "#f5f5f5", color: "#666" };
  }
}

export default function AttendanceTable() {
  return (
    <div style={{ 
      backgroundColor: "#ffffff", 
      borderRadius: "12px",
      overflow: "hidden"
    }}>
      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse" 
      }}>
        {/* Header Tabel */}
        <thead>
          <tr style={{ backgroundColor: "#fef9e7" }}>            <th style={headerStyle}>Nama Karyawan</th>
            <th style={headerStyle}>Divisi</th>
            <th style={headerStyle}>Jabatan</th>
            <th style={headerStyle}>Waktu Masuk</th>
            <th style={headerStyle}>Waktu Keluar</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}></th>
          </tr>
        </thead>

        {/* Body Tabel */}
        <tbody>
          {attendanceData.map((row, index) => (
            <tr key={index} style={{ 
              borderBottom: "1px solid #f0f0f0" 
            }}>
              <td style={cellStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Avatar placeholder */}
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#e0e0e0"
                  }}></div>
                  {row.name}
                </div>
              </td>
              <td style={cellStyle}>{row.division}</td>
              <td style={cellStyle}>{row.position}</td>
              <td style={cellStyle}>{row.timeIn}</td>
              <td style={cellStyle}>{row.timeOut}</td>
              <td style={cellStyle}>
                <span style={{
                  ...getStatusStyle(row.status),
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "500"
                }}>
                  {row.status}
                </span>
              </td>
              <td style={cellStyle}>
                <button style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#999"
                }}>
                  
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Style untuk header dan cell (biar tidak重复)
const headerStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600",
  color: "#555"
};

const cellStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#333"
};