import { ArrowLeft } from 'lucide-react';
import { evidenceList, suspects } from '../data/gameData';
import type { Screen } from '../types/progression';

type Props = {
  onNavigate: (screen: Screen) => void;
  suspectId: string | null;
};

export function SuspectDetailsScreen({ onNavigate, suspectId }: Props) {
  const suspect = suspects.find((item) => item.id === suspectId) ?? suspects[0];
  const relatedEvidence = evidenceList.filter((evidence) => evidence.relatedSuspectIds.includes(suspect.id));

  return (
    <section className="screenStack fadeIn">
      <button className="ghostButton" onClick={() => onNavigate('suspects')}>
        <ArrowLeft size={17} />
        Назад к фигурантам
      </button>

      <article className="profileHero">
        <div className="avatar large">{suspect.avatarInitials}</div>
        <div>
          <p className="eyebrow">{suspect.role}</p>
          <h2>{suspect.name}</h2>
          <p>{suspect.profile}</p>
        </div>
      </article>

      <div className="cardGrid">
        <InfoBlock title="Возможный мотив" text={suspect.motive} />
        <InfoBlock title="Алиби" text={suspect.alibi} />
      </div>

      <div className="card">
        <h3>Противоречия</h3>
        <div className="checkList danger">
          {suspect.contradictions.map((item) => <div key={item}><span />{item}</div>)}
        </div>
      </div>

      <div className="card">
        <h3>Связанные улики</h3>
        <div className="tagRow">
          {relatedEvidence.map((evidence) => <span className="tag" key={evidence.id}>{evidence.title}</span>)}
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ text, title }: { text: string; title: string }) {
  return (
    <article className="card compact">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
