import { useState, useEffect } from 'react';
import './App.css';
import Calander from './components/Calander';
import Chart from './components/Chart';
import AnimatedNumber from './components/AnimatedNumber';
import { summaryMetrics } from './components/data';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [metrics, setMetrics] = useState(summaryMetrics);
  const [isDarkMode, setIsDarkMode] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') === 'dark';
  }
  return false;
});

useEffect(() => {
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}, [isDarkMode]);

  useEffect(() => {
    setMetrics({
      totalEstimated: Math.floor(Math.random() * 4000) + 1000,
      totalActual: Math.floor(Math.random() * 4000) + 1000,
      extraToBuy: Math.floor(Math.random() * 200),
      errorPercentage: parseFloat((Math.random() * 5).toFixed(2)),
    });
  }, [selectedDate]);



  return (
    <div className={`dashboard-layout ${isDarkMode ? 'dark' : ''}`}>
      <aside className="calendar-panel">
        <Calander selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </aside>

      <main className="data-panel">
        <header className="dashboard-header">
          <h1 className="sr-only">Energy Production Dashboard</h1>
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <section aria-label="Energy Summary Metrics" className="summary-section">
          <article className="metric-card">
            <h3>Estimated Energy</h3>
            <p className="metric-value">
              <AnimatedNumber value={metrics.totalEstimated} /> <span>MW</span>
            </p>
          </article>
          <article className="metric-card">
            <h3>Actual Energy</h3>
            <p className="metric-value">
              <AnimatedNumber value={metrics.totalActual} /> <span>MW</span>
            </p>
          </article>
          <article className="metric-card alert">
            <h3>Extra to Buy</h3>
            <p className="metric-value">
              <AnimatedNumber value={metrics.extraToBuy} /> <span>MW</span>
            </p>
          </article>
          <article className="metric-card">
            <h3>Error</h3>
            <p className="metric-value">
              <AnimatedNumber value={metrics.errorPercentage} /> <span>%</span>
            </p>
          </article>
        </section>

        <section aria-labelledby="chart-heading" className="chart-section">
          <h2 id="chart-heading">Wind Energy: <time dateTime={selectedDate.toISOString()}>{selectedDate.toDateString()}</time></h2>
          <Chart isDarkMode={isDarkMode} /> 
        </section>
      </main>
    </div>
  );
}

export default App;