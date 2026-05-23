import { CheckCircle2, ClipboardList } from 'lucide-react';
import { caseInfo, stages } from '../data/gameData';
import { useGame } from '../context/GameContext';

export function CaseScreen() {
  const { state } = useGame();

  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Case archive</p>
        <h2>{caseInfo.fullTitle}</h2>
        <p>{caseInfo.subtitle}</p>
      </div>

      <article className="caseBrief">
        <ClipboardList size={22} />
        <div>
          <h3>Завязка</h3>
          <p>{caseInfo.description}</p>
        </div>
      </article>

      <div className="card">
        <h3>Правила расследования</h3>
        <div className="checkList">
          {caseInfo.rules.map((rule) => (
            <div key={rule}>
              <CheckCircle2 size={16} />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stageList">
        {stages.map((stage) => (
          <article className={stage.id === state.currentStage ? 'stageCard current' : stage.id < state.currentStage ? 'stageCard complete' : 'stageCard'} key={stage.id}>
            <span className="stageIndex">0{stage.id}</span>
            <div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <small>{stage.objective}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
