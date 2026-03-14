import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Download, Activity, Cpu, Bot, Loader2, Network, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, Legend } from 'recharts';

// Futuristic Neon Colors for the Pie Chart
const COLORS = ['#0ea5e9', '#7000ff', '#39ff14', '#ff6700', '#00f2fe'];

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/crypto-data');
        setChartData(response.data.timeline);
        setPieData(response.data.distribution);
      } catch (err) {
        console.error("Failed to fetch interactive chart data", err);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming backend runs on localhost:8000
      const response = await axios.get('http://localhost:8000/api/download-report', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Stock_Market_Intelligence_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError('Failed to generate the report. Make sure the backend serves the API on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#121212] flex items-start md:items-center justify-center overflow-x-hidden py-10">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-10 w-72 h-72 md:w-96 md:h-96 bg-sky-blue rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-10 w-72 h-72 md:w-96 md:h-96 bg-hard-purple rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-10 w-72 h-72 md:w-96 md:h-96 bg-hard-green rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl px-4 sm:px-6 md:px-8"
      >
        <div className="bg-[#1e1e1e]/60 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-6 sm:p-10 md:p-14 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="w-24 h-24 mx-auto bg-gradient-to-tr from-sky-blue via-hard-purple to-hard-green rounded-2xl flex items-center justify-center p-1 mb-6 md:mb-8 shadow-[0_0_40px_rgba(14,165,233,0.3)] cursor-pointer hover:scale-105 transition-transform overflow-hidden"
          >
            <div className="w-full h-full bg-space/90 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src="/stock-market-logo.avif" 
                alt="Stock Market Intelligence Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <h1 className="relative z-50 text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 md:mb-8 tracking-tight drop-shadow-lg block leading-tight">
            Stock Market Intelligence
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-blue-200/80 mb-10 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Initialize data aggregation protocols. Synthesize the latest equities and financial market telemetry into a unified, high-fidelity PDF report.
          </p>

          {/* New Interactive Chart Section */}
          <div className="mt-4 text-left border-t border-white/10 pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* Line Chart Panel */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Activity className="text-glow w-6 h-6" /> Live Market Telemetry
                </h2>
                <p className="text-gray-400 text-sm mb-4 md:mb-6 max-w-xl">
                  Displaying real-time cryptographic asset valuation (BTC/INR) synthesized directly from Node Alpha.
                </p>

                <div className="h-64 sm:h-80 w-full glass-panel p-3 sm:p-4">
                  {chartLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-blue-300 gap-3">
                      <Loader2 className="animate-spin w-8 h-8" />
                      <span>Calibrating Neural Sensors...</span>
                    </div>
                  ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#94a3b8"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `₹${(value / 1e6).toFixed(1)}M`}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: 'white' }}
                          itemStyle={{ color: '#0ea5e9' }}
                          formatter={(value) => [`₹${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Price']}
                          labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-red-300">
                      Data stream disconnected.
                    </div>
                  )}
                </div>
              </div>

              {/* Pie Chart Panel */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <PieChartIcon className="text-neon w-6 h-6" /> Asset Dominance Engine
                </h2>
                <p className="text-gray-400 text-sm mb-4 md:mb-6 max-w-xl">
                  Global market composition of the top 5 overarching cryptographic entities.
                </p>

                <div className="h-64 sm:h-80 w-full glass-panel p-3 sm:p-4">
                  {chartLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-blue-300 gap-3">
                      <Loader2 className="animate-spin w-8 h-8" />
                      <span>Synthesizing Global Ratios...</span>
                    </div>
                  ) : pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="market_cap"
                          nameKey="name"
                          animationDuration={1500}
                          animationEasing="ease-out"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: 'white' }}
                          formatter={(value) => [`₹${(value / 1e12).toFixed(2)} Trillion`, 'Market Cap']}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-red-300">
                      Distribution stream unavailable.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 flex flex-col items-center justify-center border-t border-white/10 pt-8 md:pt-10">
            <p className="text-gray-400 text-sm italic text-center mb-6">
              Requires deep-dive archival? Initialize the physical synthesis module below.
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 242, 254, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={generateReport}
                disabled={loading}
                className={`group relative flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all cursor-pointer overflow-hidden ${loading
                  ? 'bg-white/10 pointer-events-none'
                  : 'bg-gradient-to-r from-sky-blue via-hard-purple to-hard-green text-white shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.6)]'
                  }`}
              >
                <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-r from-glow to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-3">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-6 h-6" />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 group-hover:animate-bounce" />
                      Download Intelligence Report
                    </>
                  )}
                </div>
              </motion.button>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm font-medium bg-red-900/20 py-2 px-4 rounded-lg inline-block border border-red-500/30"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-left border-t border-white/10 pt-8 md:pt-10">
            <div className="glass-panel p-5 md:p-6 flex flex-col items-center text-center">
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mb-3 md:mb-4" />
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">Real-time Parsing</h3>
              <p className="text-xs md:text-sm text-gray-400 px-2">Fetching live 7-day algorithmic data streams directly from node origins.</p>
            </div>
            <div className="glass-panel p-5 md:p-6 flex flex-col items-center text-center">
              <Cpu className="w-6 h-6 md:w-8 md:h-8 text-glow mb-3 md:mb-4" />
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">Neural Visualization</h3>
              <p className="text-xs md:text-sm text-gray-400 px-2">Rendering high-fidelity chart matrices through robust computational pipelines.</p>
            </div>
            <div className="glass-panel p-5 md:p-6 flex flex-col items-center text-center sm:col-span-2 md:col-span-1">
              <Network className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mb-3 md:mb-4" />
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">PDF Compilation</h3>
              <p className="text-xs md:text-sm text-gray-400 px-2">Exporting intelligence directly into universally accessible, portable formats.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
