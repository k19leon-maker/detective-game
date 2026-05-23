import { timelineEvents } from '../data/gameData';
import { useGame } from '../context/GameContext';
import { certaintyLabel } from '../utils/labels';

export function TimelineScreen() {
  const { state } = useGame();

  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Chronology</p>
        <h2>Хронология</h2>
        <p>Последовательность событий меняется по мере открытия скрытых фактов.</p>
      </div>

      <div className="timeline">
        {timelineEvents.map((event) => {
          const isVisible = !event.revealRequirement?.discoveredEvidenceIds?.some((id) => !state.discoveredEvidenceIds.includes(id));
          return (
            <article className={`timelineEvent ${event.certainty} ${isVisible ? '' : 'concealed'}`} key={event.id}>
              <div className="timelineTime">
                <strong>{isVisible ? event.time : '??:??'}</strong>
                <span>{isVisible ? event.date : 'закрыто'}</span>
              </div>
              <div>
                <span className="tag">{certaintyLabel(isVisible ? event.certainty : 'hidden')}</span>
                <h3>{isVisible ? event.title : 'Событие скрыто'}</h3>
                <p>{isVisible ? event.description : 'Откройте связанные улики, чтобы восстановить этот фрагмент цепочки.'}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
