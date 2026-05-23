import { Eye, FileSearch, MessageSquareWarning, UserRoundSearch } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import { crimeSceneItems } from '../data/crimeSceneData';
import { caseInfo } from '../data/gameData';
import type { Screen } from '../types/progression';

type Props = {
  onNavigate: (screen: Screen) => void;
  onSelectEvidence: (id: string) => void;
  onSelectSuspect: (id: string) => void;
};

export function CaseScreen({ onNavigate, onSelectEvidence, onSelectSuspect }: Props) {
  const { discoverEvidence, hasInspectedSceneItem, inspectSceneItem, isSarahInterrogationUnlocked, state } = useGame();
  const [activeItemId, setActiveItemId] = useState(crimeSceneItems[0].id);
  const activeItem = useMemo(() => crimeSceneItems.find((item) => item.id === activeItemId) ?? crimeSceneItems[0], [activeItemId]);
  const inspectedCount = crimeSceneItems.filter((item) => state.inspectedSceneItemIds.includes(item.id)).length;

  function inspect(id: string) {
    setActiveItemId(id);
    inspectSceneItem(id);
  }

  function openEvidence(id: string) {
    discoverEvidence(id);
    onSelectEvidence(id);
    onNavigate('evidence-detail');
  }

  function openSarah() {
    onSelectSuspect('sarah-miller');
    onNavigate('suspect-detail');
  }

  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Playable episode 01</p>
        <h2>Номер 314</h2>
        <p>Официальная версия проста. Комната — нет. Осмотрите детали, а не выводы.</p>
      </div>

      <article className="crimeScene">
        <div className="sceneHeader">
          <div>
            <p className="eyebrow">Black Pier Hotel · 14 октября</p>
            <h3>Место смерти Марка Ривза</h3>
          </div>
          <span>{inspectedCount}/{crimeSceneItems.length} деталей</span>
        </div>

        <div className="scenePhoto" aria-label="Номер 314, режим осмотра">
          <div className="roomWindow" />
          <div className="roomDesk" />
          <div className="roomBody" />
          <div className="roomChair" />
          <div className="sceneVignette" />
          {crimeSceneItems.map((item) => (
            <button
              className={`sceneMarker ${activeItemId === item.id ? 'active' : ''} ${hasInspectedSceneItem(item.id) ? 'seen' : ''}`}
              key={item.id}
              onClick={() => inspect(item.id)}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <Eye size={14} />
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        <div className="observationPanel">
          <div>
            <p className="eyebrow">Inspect mode</p>
            <h3>{activeItem.title}</h3>
            <p>{activeItem.observation}</p>
          </div>
          <blockquote>{activeItem.thought}</blockquote>
          <small>{activeItem.detail}</small>
        </div>
      </article>

      <div className="episodeActions">
        <button onClick={() => openEvidence('case-file')}>
          <FileSearch size={18} />
          Полицейское досье
        </button>
        <button onClick={() => openEvidence('msg-warning')}>
          <MessageSquareWarning size={18} />
          Переписка Марка
        </button>
        <button className={isSarahInterrogationUnlocked ? 'available' : ''} disabled={!isSarahInterrogationUnlocked} onClick={openSarah}>
          <UserRoundSearch size={18} />
          Допрос Сары
        </button>
      </div>

      <article className="caseBrief">
        <div>
          <h3>{caseInfo.fullTitle}</h3>
          <p>{caseInfo.description}</p>
        </div>
      </article>
    </section>
  );
}
