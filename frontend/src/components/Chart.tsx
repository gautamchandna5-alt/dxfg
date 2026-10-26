import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { chartData } from "./data";

export default function Chart({ isDarkMode }: { isDarkMode: boolean }) {
  const textColor = isDarkMode ? "#94a3b8" : "#64748b";
  const gridColor = isDarkMode ? "#334155" : "#e2e8f0";
  const tooltipBg = isDarkMode ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDarkMode ? "#334155" : "#e2e8f0";

  return (
    <figure className="chart-container" style={{ width: "100%", height: 400, margin: 0 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="time" stroke={textColor} tick={{ fill: textColor }} />
          <YAxis stroke={textColor} tick={{ fill: textColor }} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              color: isDarkMode ? '#f1f5f9' : '#0f172a'
            }} 
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: textColor }} />
          <Line 
            type="monotone" 
            dataKey="estimated" 
            stroke="#8884d8" 
            strokeWidth={3}
            dot={{ r: 4 }} 
            activeDot={{ r: 8 }} 
            name="Estimated Energy (MW)" 
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#82ca9d" 
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Actual Energy (MW)" 
          />
        </LineChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">Line graph comparing estimated and actual wind energy production in MW</figcaption>
    </figure>
  );
}