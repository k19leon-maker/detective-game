import { Search } from 'lucide-react';
import { caseInfo } from '../data/gameData';
import { useGame } from '../context/GameContext';

export function Header() {
  const { progressPercent, state } = useGame();

  return (
    <header className="header">
      <div>
        <p className="eyebrow">FBI archive · stage {state.currentStage}</p>
        <h1>{caseInfo.title}</h1>
        <p>{caseInfo.caseNumber} · {progressPercent}% материалов изучено</p>
      </div>
      <div className="headerIcon">
        <Search size={28} />
      </div>
    </header>
  );
}
