import { evidenceList, stages } from '../data/gameData';
import { useGame } from '../context/GameContext';

export function ProgressScreen() {
  const { progressPercent, state } = useGame();

  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Progression</p>
        <h2>Прогресс расследования</h2>
        <p>Этапы открываются через изучение материалов и ключевых противоречий.</p>
      </div>

      <div className="progressHero">
        <strong>{progressPercent}%</strong>
        <span>материалов изучено</span>
        <div className="progressBar"><i style={{ width: `${progressPercent}%` }} /></div>
      </div>

      <div className="stageList">
        {stages.map((stage) => (
          <article className={stage.id === state.currentStage ? 'stageCard current' : stage.id < state.currentStage ? 'stageCard complete' : 'stageCard'} key={stage.id}>
            <span className="stageIndex">0{stage.id}</span>
            <div>
              <h3>{stage.title}</h3>
              <p>{stage.objective}</p>
              <small>{Math.min(state.discoveredEvidenceIds.length, stage.requiredDiscoveries)} / {stage.requiredDiscoveries} материалов</small>
            </div>
          </article>
        ))}
      </div>

      <article className="card compact">
        <h3>Открыто улик</h3>
        <p>{state.discoveredEvidenceIds.length} из {evidenceList.length}. Финальный конверт требует ключевую цепочку по Эрику.</p>
      </article>
    </section>
  );
}
