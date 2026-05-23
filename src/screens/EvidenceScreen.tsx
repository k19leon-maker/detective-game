import { Lock, Unlock } from 'lucide-react';
import { evidenceList } from '../data/gameData';
import { useGame } from '../context/GameContext';
import type { Screen } from '../types/progression';
import { evidenceTypeLabel, priorityLabel } from '../utils/labels';

type Props = {
  onSelectEvidence: (id: string) => void;
  onNavigate: (screen: Screen) => void;
};

export function EvidenceScreen({ onNavigate, onSelectEvidence }: Props) {
  const { getEvidenceStatus } = useGame();

  function openEvidence(id: string, isLocked: boolean) {
    if (isLocked) return;
    onSelectEvidence(id);
    onNavigate('evidence-detail');
  }

  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Evidence vault</p>
        <h2>Улики</h2>
        <p>Открывайте материалы, сверяйте источники и ищите следы инсценировки.</p>
      </div>

      <div className="evidenceGrid">
        {evidenceList.map((evidence) => {
          const status = getEvidenceStatus(evidence);
          const isLocked = status === 'locked';
          return (
            <button className={`evidenceCard ${status}`} key={evidence.id} onClick={() => openEvidence(evidence.id, isLocked)}>
              <div className="evidenceTopline">
                <span>{evidenceTypeLabel(evidence.type)}</span>
                <span className={`priority ${evidence.priority}`}>{priorityLabel(evidence.priority)}</span>
              </div>
              <h3>{evidence.title}</h3>
              <p>{isLocked ? 'Материал закрыт. Продвиньтесь по расследованию, чтобы получить доступ.' : evidence.summary}</p>
              <div className="evidenceFooter">
                <span>Этап {evidence.stage}</span>
                {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
