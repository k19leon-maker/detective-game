import { useState } from 'react';
import { evidenceList, suspects } from '../data/gameData';
import { useGame } from '../context/GameContext';

export function FinalAccusationScreen() {
  const { accusationResult, state, submitFinalAccusation } = useGame();
  const [suspectId, setSuspectId] = useState('eric-nolan');
  const [motive, setMotive] = useState('');
  const [chain, setChain] = useState<string[]>([]);
  const discovered = evidenceList.filter((evidence) => state.discoveredEvidenceIds.includes(evidence.id));
  const canAccuse = state.currentStage >= 5 || discovered.length >= 10;

  function toggleEvidence(id: string) {
    setChain((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  if (!canAccuse) {
    return (
      <section className="screenStack fadeIn">
        <div className="lockedPanel">
          <h2>Финальное обвинение закрыто</h2>
          <p>Соберите больше материалов. Пока теория не выдержит проверки фактами.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Final accusation</p>
        <h2>Финальное обвинение</h2>
        <p>Выберите убийцу, сформулируйте мотив и соберите цепочку доказательств.</p>
      </div>

      <div className="card">
        <label className="fieldLabel">
          Убийца
          <select value={suspectId} onChange={(event) => setSuspectId(event.target.value)}>
            {suspects.map((suspect) => <option key={suspect.id} value={suspect.id}>{suspect.name}</option>)}
          </select>
        </label>
        <label className="fieldLabel">
          Мотив
          <textarea value={motive} onChange={(event) => setMotive(event.target.value)} placeholder="Почему убийца пошел на риск?" />
        </label>
      </div>

      <div className="card">
        <h3>Цепочка доказательств</h3>
        <div className="evidenceChoiceList">
          {discovered.map((evidence) => (
            <button className={chain.includes(evidence.id) ? 'choice selected' : 'choice'} key={evidence.id} onClick={() => toggleEvidence(evidence.id)}>
              {evidence.title}
            </button>
          ))}
        </div>
        <button className="primaryButton" onClick={() => submitFinalAccusation({ chain, motive, suspectId })}>
          Предъявить обвинение
        </button>
      </div>

      {accusationResult ? (
        <div className={`revealScreen ${accusationResult}`}>
          <p className="eyebrow">{accusationResult === 'correct' ? 'Case closed' : 'Theory unstable'}</p>
          <h2>{accusationResult === 'correct' ? 'Эрик Нолан разоблачен' : 'Версия не выдержала проверки'}</h2>
          <p>
            {accusationResult === 'correct'
              ? 'Цепочка сходится: инсценировка Марка отвлекла всех, но настоящий след остался в серверной.'
              : 'В деле еще есть разрывы. Вернитесь к уликам, хронологии и доске расследования.'}
          </p>
        </div>
      ) : null}
    </section>
  );
}
