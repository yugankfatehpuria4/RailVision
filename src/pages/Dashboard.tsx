import { useState, useEffect, lazy, Suspense } from 'react';
import { useAnalysisStore } from '@/lib/store';
import { ThreatStrip } from '@/components/dashboard/ThreatStrip';
import { NavBar } from '@/components/dashboard/NavBar';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { RightPanel } from '@/components/dashboard/RightPanel';
import { DetectionResultsPanel } from '@/components/dashboard/DetectionResultsPanel';
import { ChangeDetectionPanel } from '@/components/dashboard/ChangeDetectionPanel';
import { SOSButton } from '@/components/dashboard/SOSButton';
import { SOSModal } from '@/components/dashboard/SOSModal';
import { SOSPanel } from '@/components/dashboard/SOSPanel';
import { DUMMY_DETECTIONS, DUMMY_IMAGES } from '@/lib/dummy-data';

const MapContainer = lazy(() =>
  import('@/components/dashboard/MapContainer').then((m) => ({ default: m.MapContainer }))
);

export default function DashboardPage() {
  const {
    initialized, initializeWithDummyData, detections, isProcessing, processingStatus,
    activeDetectionResults, checkBackend, loadSOSIncidents, sosIncidents,
  } = useAnalysisStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedZone] = useState('Western Railway');

  useEffect(() => {
    if (!initialized) {
      initializeWithDummyData(DUMMY_IMAGES, DUMMY_DETECTIONS);
    }
    checkBackend();
    loadSOSIncidents();
  }, [initialized, initializeWithDummyData, checkBackend, loadSOSIncidents]);

  const detectionCount = activeDetectionResults?.summary?.total_detections || detections.length;
  const encroachmentCount = activeDetectionResults?.summary?.encroachment_count || detections.filter((d) => d.type === 'encroachment').length;
  const damageCount = detections.filter((d) => d.type === 'damage').length;
  const threatLevel = activeDetectionResults?.threat_level || (
    encroachmentCount > 5 ? 'critical' : encroachmentCount > 3 ? 'high' : encroachmentCount > 1 ? 'medium' : 'low'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', color: 'var(--tp)', position: 'relative', overflow: 'hidden' }}>
      {/* Global Background Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Global Scanline Effect */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
        backgroundSize: '100% 4px, 3px 100%', pointerEvents: 'none', zIndex: 5, opacity: 0.2,
      }} />

      <ThreatStrip
        threatLevel={threatLevel as any}
        detectionCount={detectionCount}
        encroachmentCount={encroachmentCount}
        damageCount={damageCount}
        sosCount={sosIncidents.length}
      />
      <NavBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} userName="Admin" userRole={selectedZone} />
      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
        {sidebarOpen && <LeftSidebar />}
        <Suspense fallback={
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bgc)' }}>
            <div className="flex flex-col items-center gap-4">
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--bdr)', borderTopColor: 'var(--ab)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', color: 'var(--ts)', letterSpacing: '0.1em' }}>INITIALIZING GIS ENGINE...</div>
            </div>
          </div>
        }>
          <MapContainer isProcessing={isProcessing} processingStatus={processingStatus} />
        </Suspense>
        <DetectionResultsPanel />
        <ChangeDetectionPanel />
        <SOSPanel />
        <RightPanel />
      </div>
      <SOSButton />
      <SOSModal />
    </div>
  );
}

