import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CalanderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i);

export default function Calander({ selectedDate, onSelectDate }: CalanderProps) {
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync calendar view if date is changed externally
  useEffect(() => {
    setViewMonth(selectedDate.getMonth());
    setViewYear(selectedDate.getFullYear());
  }, [selectedDate]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

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
    onSelectDate(new Date(viewYear, viewMonth, day));
    setIsMobileOpen(false); // Auto-close popover on mobile
  };

  return (
    <nav aria-label="Calendar Navigation" className="calendar-container">
      
      {/* Mobile Navbar Toggle Button */}
      <button 
        className="mobile-date-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-expanded={isMobileOpen}
      >
        {formattedDate} <span aria-hidden="true" className="dropdown-arrow">{isMobileOpen ? '▲' : '▼'}</span>
      </button>

      {/* Calendar Body: Popover on Mobile, Static on Desktop */}
      <div className={`calendar-content ${isMobileOpen ? 'open' : ''}`}>
        <fieldset className="calendar-selectors">
          <legend className="sr-only">Select Month and Year</legend>
          <select 
            aria-label="Month"
            value={viewMonth} 
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="month-select"
          >
            {MONTHS.map((month, idx) => (
               <option key={month} value={idx}>{month}</option>
            ))}
          </select>
          <select 
            aria-label="Year"
            value={viewYear} 
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="year-select"
          >
            {YEARS.map(year => (
               <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </fieldset>

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

              const isSelected = 
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getFullYear() === viewYear;

              const dateString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

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