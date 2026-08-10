interface SummaryCardProps {
  icon: string;
  count: number | string;
  label: string;
  bgColor: string;
  iconBgColor: string;
}

export default function SummaryCard({ icon, count, label, bgColor, iconBgColor
 }: SummaryCardProps) {
  return (
    <div style={{ 
      backgroundColor: bgColor,
      borderRadius: "12px",
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: "1 1 180px",
      maxWidth: "240px",
      minWidth: "160px",
     }}>
      <div style={{
        backgroundColor: iconBgColor,
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
      }}>
        {icon}
      </div>

      <div>
        <div style={{ 
          fontSize: "28px", 
          fontWeight: "bold",
          color: "#333"
        }}>
          {count}
        </div>
        <div style={{ 
          fontSize: "13px", 
          color: "#666"
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}