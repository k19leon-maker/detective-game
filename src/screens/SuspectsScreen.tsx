import type { Screen } from '../types/progression';
import { suspects } from '../data/gameData';
import { SuspectAvatar } from '../components/SuspectAvatar';

type Props = {
  onNavigate: (screen: Screen) => void;
  onSelectSuspect: (id: string) => void;
};

export function SuspectsScreen({ onNavigate, onSelectSuspect }: Props) {
  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Persons of interest</p>
        <h2>Фигуранты</h2>
        <p>Каждый что-то скрывает. Не каждый убийца.</p>
      </div>

      <div className="suspectList">
        {suspects.map((suspect) => (
          <button
            className={`suspectCard suspicion-${suspect.suspicionLevel}`}
            key={suspect.id}
            onClick={() => {
              onSelectSuspect(suspect.id);
              onNavigate('suspect-detail');
            }}
          >
            <SuspectAvatar suspect={suspect} />
            <div>
              <h3>{suspect.name}</h3>
              <span className="tag">{suspect.role}</span>
              <p>{suspect.shortDescription}</p>
              <div className="suspicionMeter">
                <span style={{ width: `${suspect.suspicionLevel * 20}%` }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
