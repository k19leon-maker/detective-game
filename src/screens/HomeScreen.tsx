import { ArrowRight, Eye, FolderOpen, ShieldAlert } from 'lucide-react';
import { caseInfo, stages } from '../data/gameData';
import { useGame } from '../context/GameContext';
import type { Screen } from '../types/progression';

type Props = {
  onNavigate: (screen: Screen) => void;
};

export function HomeScreen({ onNavigate }: Props) {
  const { progressPercent, state } = useGame();
  const stage = stages.find((item) => item.id === state.currentStage) ?? stages[0];

  return (
    <section className="screenStack fadeIn">
      <div className="cinematicHero">
        <div className="scanline" />
        <p className="eyebrow">{caseInfo.caseNumber}</p>
        <h2>{caseInfo.title}</h2>
        <p>{caseInfo.description}</p>
        <div className="heroMeta">
          <span>{caseInfo.location}</span>
          <span>{caseInfo.openedAt}</span>
        </div>
        <button className="primaryButton" onClick={() => onNavigate('case')}>
          Открыть архив
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="statusGrid">
        <div>
          <ShieldAlert size={18} />
          <strong>{stage.label}</strong>
          <span>{stage.title}</span>
        </div>
        <div>
          <FolderOpen size={18} />
          <strong>{progressPercent}%</strong>
          <span>прогресс</span>
        </div>
        <div>
          <Eye size={18} />
          <strong>{state.discoveredEvidenceIds.length}</strong>
          <span>открыто</span>
        </div>
      </div>

      <article className="paperCard">
        <h3>Оперативный брифинг</h3>
        <p>{caseInfo.briefing}</p>
      </article>
    </section>
  );
}
