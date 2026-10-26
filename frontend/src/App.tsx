import { useState, useEffect } from 'react';
import './App.css';
import Calander from './components/Calander';
import Chart from './components/Chart';
import AnimatedNumber from './components/AnimatedNumber';

function App() {
  // Lock initial state to January 1, 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 1));
  const [metrics, setMetrics] = useState({ totalEstimated: 0, totalActual: 0, extraToBuy: 0, errorPercentage: 0 });
  const [chartData, setChartData] = useState([]);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'dark';
    return false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

// Fetch DRF backend data
  useEffect(() => {
    const fetchData = async () => {
      const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

      const API_BASE_URL = import.meta.env.DEV 
        ? 'http://127.0.0.1:8000' 
        : 'https://energy-dashboard-gtze.onrender.com/'; 
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/energy/?date=${dateString}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        
        setMetrics(data.summaryMetrics);
        setChartData(data.chartData);
      } catch (error) {
        console.error("Error loading energy data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className={`dashboard-layout ${isDarkMode ? 'dark' : ''}`}>
      <aside className="calendar-panel">
        <Calander selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </aside>

      <main className="data-panel">
        <header className="dashboard-header">
          <h1 className="sr-only">Energy Production Dashboard</h1>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <section className="summary-section">
          <article className="metric-card">
            <h3>Estimated Energy</h3>
            <p className="metric-value"><AnimatedNumber value={metrics.totalEstimated} /> <span>MW</span></p>
          </article>
          <article className="metric-card">
            <h3>Actual Energy</h3>
            <p className="metric-value"><AnimatedNumber value={metrics.totalActual} /> <span>MW</span></p>
          </article>
          <article className="metric-card alert">
            <h3>Extra to Buy</h3>
            <p className="metric-value"><AnimatedNumber value={metrics.extraToBuy} /> <span>MW</span></p>
          </article>
          <article className="metric-card">
            <h3>Error</h3>
            <p className="metric-value"><AnimatedNumber value={metrics.errorPercentage} /> <span>%</span></p>
          </article>
        </section>

        <section className="chart-section">
          <h2>Wind Energy: <time dateTime={selectedDate.toISOString()}>{selectedDate.toDateString()}</time></h2>
          {/* Pass the dynamically fetched data to the Chart */}
          <Chart isDarkMode={isDarkMode} data={chartData} /> 
        </section>
      </main>
    </div>
  );
}

export default App;