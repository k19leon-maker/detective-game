import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { GameProvider } from './context/GameContext';
import { CaseScreen } from './screens/CaseScreen';
import { EvidenceDetailsScreen } from './screens/EvidenceDetailsScreen';
import { EvidenceScreen } from './screens/EvidenceScreen';
import { FinalAccusationScreen } from './screens/FinalAccusationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SuspectDetailsScreen } from './screens/SuspectDetailsScreen';
import { SuspectsScreen } from './screens/SuspectsScreen';
import { TheoryBoardScreen } from './screens/TheoryBoardScreen';
import { TimelineScreen } from './screens/TimelineScreen';
import type { Screen } from './types/game';

function getTelegramUserName() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!user) return 'Детектив';
  return user.first_name || user.username || 'Детектив';
}

function DetectiveApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>('case-file');
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>('eric-nolan');
  const playerName = useMemo(() => getTelegramUserName(), []);

  useEffect(() => {
    window.Telegram?.WebApp?.ready();
    window.Telegram?.WebApp?.expand();
  }, []);

  function renderScreen() {
    if (screen === 'home') return <HomeScreen onNavigate={setScreen} />;
    if (screen === 'case') return <CaseScreen onNavigate={setScreen} onSelectEvidence={setSelectedEvidenceId} onSelectSuspect={setSelectedSuspectId} />;
    if (screen === 'evidence') return <EvidenceScreen onNavigate={setScreen} onSelectEvidence={setSelectedEvidenceId} />;
    if (screen === 'evidence-detail') return <EvidenceDetailsScreen evidenceId={selectedEvidenceId} onNavigate={setScreen} />;
    if (screen === 'suspects') return <SuspectsScreen onNavigate={setScreen} onSelectSuspect={setSelectedSuspectId} />;
    if (screen === 'suspect-detail') return <SuspectDetailsScreen onNavigate={setScreen} suspectId={selectedSuspectId} />;
    if (screen === 'timeline') return <TimelineScreen />;
    if (screen === 'theory') return <TheoryBoardScreen />;
    if (screen === 'progress') return <ProgressScreen />;
    return <FinalAccusationScreen />;
  }

  return (
    <div className="app">
      <div className="ambientGlow" />
      <Header />
      <main className="content">
        <div className="playerStrip">
          <span>Оператор: {playerName}</span>
          <button onClick={() => setScreen('progress')}>Прогресс</button>
        </div>
        {renderScreen()}
      </main>
      <BottomNav currentScreen={screen} onChange={setScreen} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <DetectiveApp />
    </GameProvider>
  );
}
