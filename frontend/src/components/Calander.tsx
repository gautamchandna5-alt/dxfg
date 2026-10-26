import { useState } from "react";
import { motion } from "framer-motion";

interface CalanderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEW_MONTH = 0; // 0-indexed for January
const VIEW_YEAR = 2026;

export default function Calander({ selectedDate, onSelectDate }: CalanderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const daysInMonth = new Date(VIEW_YEAR, VIEW_MONTH + 1, 0).getDate();
  const firstDayOfMonth = new Date(VIEW_YEAR, VIEW_MONTH, 1).getDay();

  const gridCells: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDaySelect = (day: number) => {
    onSelectDate(new Date(VIEW_YEAR, VIEW_MONTH, day));
    setIsMobileOpen(false); 
  };

  return (
    <nav aria-label="Calendar Navigation" className="calendar-container">
      
      <button 
        className="mobile-date-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-expanded={isMobileOpen}
      >
        {formattedDate} <span aria-hidden="true" className="dropdown-arrow">{isMobileOpen ? '▲' : '▼'}</span>
      </button>

      <div className={`calendar-content ${isMobileOpen ? 'open' : ''}`}>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          January 2026
        </div>

        <div role="grid" className="calendar-grid">
          <div role="row" className="calendar-row-labels">
            {WEEKDAYS.map((day) => (
              <div role="columnheader" key={day} className="calendar-day-label">
                <abbr title={day}>{day.charAt(0)}</abbr>
              </div>
            ))}
          </div>

          <div role="row" className="calendar-row-cells">
            {gridCells.map((day, index) => {
              if (day === null) {
                return <div role="gridcell" key={`empty-${index}`} className="calendar-cell empty"></div>;
              }

              const isSelected = selectedDate.getDate() === day;
              const dateString = `${VIEW_YEAR}-01-${String(day).padStart(2, '0')}`;

              return (
                <motion.button
                  role="gridcell"
                  aria-selected={isSelected}
                  key={`day-${day}`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDaySelect(day)}
                  className={`calendar-cell ${isSelected ? "selected" : ""}`}
                >
                  <time dateTime={dateString}>{day}</time>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}