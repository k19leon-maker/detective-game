import { FileText, Fingerprint, GitBranch, Home, Timer, Trophy, Users } from 'lucide-react';
import type { Screen } from '../types/game';

type Props = {
  currentScreen: Screen;
  onChange: (screen: Screen) => void;
};

const items: Array<{ screen: Screen; label: string; icon: React.ReactNode }> = [
  { screen: 'home', label: 'Старт', icon: <Home size={19} /> },
  { screen: 'case', label: 'Дело', icon: <FileText size={19} /> },
  { screen: 'evidence', label: 'Улики', icon: <Fingerprint size={19} /> },
  { screen: 'suspects', label: 'Люди', icon: <Users size={19} /> },
  { screen: 'timeline', label: 'Время', icon: <Timer size={19} /> },
  { screen: 'theory', label: 'Связи', icon: <GitBranch size={19} /> },
  { screen: 'final', label: 'Финал', icon: <Trophy size={19} /> },
];

export function BottomNav({ currentScreen, onChange }: Props) {
  return (
    <nav className="bottomNav">
      {items.map((item) => (
        <button
          key={item.screen}
          className={currentScreen === item.screen ? 'navItem active' : 'navItem'}
          onClick={() => onChange(item.screen)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
