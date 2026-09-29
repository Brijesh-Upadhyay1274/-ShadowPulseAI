import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import ErrorBoundary from './components/common/ErrorBoundary'

// Pages
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import ThreatTimeline from './pages/ThreatTimeline'
import ThreatInvestigation from './pages/ThreatInvestigation'
import ThreatGraph from './pages/ThreatGraph'
import ReplayMode from './pages/ReplayMode'
import ThreatDNA from './pages/ThreatDNA'
import AlertExplorer from './pages/AlertExplorer'
import DetectionAnalytics from './pages/DetectionAnalytics'

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050811] text-gray-200 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative z-0">
          <div className="mx-auto max-w-7xl h-full">
            <ErrorBoundary fallbackTitle="ShadowPulse SOC Interface">
              <Routes>
                <Route path="/" element={<ExecutiveDashboard />} />
                <Route path="/timeline" element={<ThreatTimeline />} />
                <Route path="/investigation" element={<ThreatInvestigation />} />
                <Route path="/graph" element={<ThreatGraph />} />
                <Route path="/replay" element={<ReplayMode />} />
                <Route path="/dna" element={<ThreatDNA />} />
                <Route path="/alerts" element={<AlertExplorer />} />
                <Route path="/analytics" element={<DetectionAnalytics />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
