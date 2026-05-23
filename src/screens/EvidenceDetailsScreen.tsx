import { ArrowLeft, Check, Lock, Radio } from 'lucide-react';
import { useEffect } from 'react';
import { evidenceList, suspects } from '../data/gameData';
import { useGame } from '../context/GameContext';
import type { Screen } from '../types/progression';
import { evidenceTypeLabel, priorityLabel } from '../utils/labels';

type Props = {
  evidenceId: string | null;
  onNavigate: (screen: Screen) => void;
};

export function EvidenceDetailsScreen({ evidenceId, onNavigate }: Props) {
  const { discoverEvidence, getEvidenceStatus, playTwist } = useGame();
  const evidence = evidenceList.find((item) => item.id === evidenceId) ?? evidenceList[0];
  const status = getEvidenceStatus(evidence);
  const relatedSuspects = suspects.filter((suspect) => evidence.relatedSuspectIds.includes(suspect.id));

  useEffect(() => {
    if (evidence.id === 'mark-tape-after-death' && status !== 'locked') playTwist();
  }, [evidence.id, playTwist, status]);

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
        <EvidenceMaterial evidenceId={evidence.id} fallback={evidence.content} />
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

function EvidenceMaterial({ evidenceId, fallback }: { evidenceId: string; fallback: string }) {
  if (evidenceId === 'case-file') {
    return (
      <div className="policeScan">
        <div className="scanStamp">BLACKWOOD PD · PRIMARY REPORT</div>
        <h3>Смерть: Mark Reeves</h3>
        <dl>
          <div><dt>Локация</dt><dd>Black Pier Hotel, номер 314</dd></div>
          <div><dt>Оценочное время смерти</dt><dd>22:17</dd></div>
          <div><dt>Версия</dt><dd>Самоубийство, без признаков борьбы</dd></div>
        </dl>
        <p>{fallback}</p>
      </div>
    );
  }

  if (evidenceId === 'msg-warning') {
    return (
      <div className="messageEvidence">
        <div className="phoneChrome">
          <span>Sarah Miller</span>
          <small>14 окт · архив телефона</small>
        </div>
        <div className="messageBubble">
          <p>Если со мной что-то случится —<br />не верьте никому из них</p>
          <span>22:31</span>
        </div>
        <div className="messageMeta">
          <strong>Metadata</strong>
          <p>Исходящее сообщение. Доставлено. Изменений временной метки не найдено.</p>
        </div>
      </div>
    );
  }

  if (evidenceId === 'mark-tape-after-death') {
    return (
      <div className="audioReveal">
        <div className="noiseLayer" />
        <Radio size={28} />
        <div className="tapeReels">
          <span />
          <span />
        </div>
        <p>шшш... щелчок... дыхание</p>
        <blockquote>“Если вы слышите это... значит официальная версия уже опубликована.”</blockquote>
        <small>Пауза 03 сек. Затем: “В номере 314 должен был умереть не я”.</small>
      </div>
    );
  }

  return <div className="evidenceDocument">{fallback}</div>;
}
