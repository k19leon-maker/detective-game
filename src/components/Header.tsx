import { Search } from 'lucide-react';
import { caseInfo } from '../data/gameData';

export function Header() {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">Detective Mini App</p>
        <h1>{caseInfo.title}</h1>
        <p>{caseInfo.subtitle}</p>
      </div>
      <div className="headerIcon">
        <Search size={28} />
      </div>
    </header>
  );
}
