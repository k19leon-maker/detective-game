import { ArrowLeft, Check, Lock } from 'lucide-react';
import { evidenceList, suspects } from '../data/gameData';
import { useGame } from '../context/GameContext';
import type { Screen } from '../types/progression';
import { evidenceTypeLabel, priorityLabel } from '../utils/labels';

type Props = {
  evidenceId: string | null;
  onNavigate: (screen: Screen) => void;
};

export function EvidenceDetailsScreen({ evidenceId, onNavigate }: Props) {
  const { discoverEvidence, getEvidenceStatus } = useGame();
  const evidence = evidenceList.find((item) => item.id === evidenceId) ?? evidenceList[0];
  const status = getEvidenceStatus(evidence);
  const relatedSuspects = suspects.filter((suspect) => evidence.relatedSuspectIds.includes(suspect.id));

  if (status === 'locked') {
    return (
      <section className="screenStack fadeIn">
        <button className="ghostButton" onClick={() => onNavigate('evidence')}>
          <ArrowLeft size={17} />
          Назад к уликам
        </button>
        <div className="lockedPanel">
          <Lock size={34} />
          <h2>Материал закрыт</h2>
          <p>Эта улика откроется после изучения связанных материалов.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="screenStack fadeIn">
      <button className="ghostButton" onClick={() => onNavigate('evidence')}>
        <ArrowLeft size={17} />
        Назад к уликам
      </button>

      <article className="detailCard">
        <div className="evidenceTopline">
          <span>{evidenceTypeLabel(evidence.type)}</span>
          <span className={`priority ${evidence.priority}`}>{priorityLabel(evidence.priority)}</span>
        </div>
        <h2>{evidence.title}</h2>
        <p className="sourceLine">{evidence.source}{evidence.timeLabel ? ` · ${evidence.timeLabel}` : ''}</p>
        <p className="leadText">{evidence.summary}</p>
        <div className="evidenceDocument">
          {evidence.content}
        </div>
        <div className="tagRow">
          {evidence.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        <button className="primaryButton" onClick={() => discoverEvidence(evidence.id)}>
          <Check size={18} />
          {status === 'discovered' ? 'Материал изучен' : 'Отметить как изученное'}
        </button>
      </article>

      <div className="card">
        <h3>Связанные фигуранты</h3>
        <div className="miniSuspects">
          {relatedSuspects.map((suspect) => (
            <div key={suspect.id}>
              <strong>{suspect.avatarInitials}</strong>
              <span>{suspect.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
