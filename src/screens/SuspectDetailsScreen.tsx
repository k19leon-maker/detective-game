import { ArrowLeft, Radio, ShieldQuestion } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { evidenceList, suspects } from '../data/gameData';
import { sarahInterrogation } from '../data/interrogationData';
import { useGame } from '../context/GameContext';
import type { Screen } from '../types/progression';

type Props = {
  onNavigate: (screen: Screen) => void;
  suspectId: string | null;
};

export function SuspectDetailsScreen({ onNavigate, suspectId }: Props) {
  const { askSarahQuestion, hasAskedSarahQuestion, isSarahInterrogationUnlocked, isTwistUnlocked, state } = useGame();
  const suspect = suspects.find((item) => item.id === suspectId) ?? suspects[0];
  const relatedEvidence = evidenceList.filter((evidence) => evidence.relatedSuspectIds.includes(suspect.id));
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const activeQuestion = useMemo(
    () => sarahInterrogation.find((question) => question.id === activeQuestionId) ?? null,
    [activeQuestionId],
  );
  const typedResponse = useTypingText(activeQuestion?.response ?? '', activeQuestionId ?? 'empty');

  function ask(id: string) {
    setActiveQuestionId(id);
    askSarahQuestion(id);
  }

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

      {suspect.id === 'sarah-miller' && (
        <article className="interrogationPanel">
          <div className="interrogationHeader">
            <div>
              <p className="eyebrow">First interrogation</p>
              <h3>Допрос Sarah Miller</h3>
            </div>
            <span>{state.askedQuestionIds.length}/{sarahInterrogation.length}</span>
          </div>

          {!isSarahInterrogationUnlocked ? (
            <div className="lockedInterrogation">
              <ShieldQuestion size={28} />
              <p>Сара пока не готова говорить. Осмотрите часы в номере 314 и сопоставьте досье с перепиской Марка.</p>
            </div>
          ) : (
            <>
              <div className="questionGrid">
                {sarahInterrogation.map((item) => (
                  <button className={activeQuestionId === item.id ? 'active' : hasAskedSarahQuestion(item.id) ? 'asked' : ''} key={item.id} onClick={() => ask(item.id)}>
                    {item.question}
                  </button>
                ))}
              </div>

              {activeQuestion ? (
                <div className="dialogueWindow">
                  <div className="dialogueLine detective">
                    <strong>Вы</strong>
                    <p>{activeQuestion.question}</p>
                  </div>
                  <div className="dialoguePause">пауза · запись идет</div>
                  <div className="dialogueLine sarah">
                    <strong>Sarah</strong>
                    <p>{typedResponse}</p>
                  </div>
                  <small>{activeQuestion.cue}</small>
                </div>
              ) : (
                <div className="dialogueWindow">
                  <div className="dialoguePause">Выберите первый вопрос. Сара смотрит на диктофон, но молчит.</div>
                </div>
              )}

              {isTwistUnlocked && (
                <button className="twistButton" onClick={() => onNavigate('evidence')}>
                  <Radio size={18} />
                  В архиве появился аудиофайл без источника
                </button>
              )}
            </>
          )}
        </article>
      )}
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

function useTypingText(text: string, key: string) {
  const [visible, setVisible] = useState('');

  useEffect(() => {
    setVisible('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 3;
      setVisible(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 18);

    return () => window.clearInterval(timer);
  }, [key, text]);

  return visible;
}
