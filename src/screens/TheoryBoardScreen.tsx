import { Link2, Send } from 'lucide-react';
import { evidenceList, suspects } from '../data/gameData';
import { useGame } from '../context/GameContext';
import { useState } from 'react';
import { SuspectAvatar } from '../components/SuspectAvatar';

export function TheoryBoardScreen() {
  const { addNote, notes, state } = useGame();
  const [noteText, setNoteText] = useState('');
  const discovered = evidenceList.filter((evidence) => state.discoveredEvidenceIds.includes(evidence.id));
  const hotSuspects = suspects.filter((suspect) => suspect.suspicionLevel >= 4);

  return (
    <section className="screenStack fadeIn">
      <div className="sectionTitle">
        <p className="eyebrow">Theory board</p>
        <h2>Доска расследования</h2>
        <p>Связывайте фигурантов, улики и собственные гипотезы. Drag-and-drop можно добавить позже.</p>
      </div>

      <div className="board">
        <div className="boardColumn">
          <h3>Фигуранты</h3>
          {hotSuspects.map((suspect) => (
            <div className="pinCard suspectPin" key={suspect.id}>
              <div className="pinSuspectRow">
                <SuspectAvatar className="tiny" suspect={suspect} />
                <div>
                  <strong>{suspect.name}</strong>
                  <span>{suspect.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="boardColumn connectorColumn">
          <h3>Связи</h3>
          {discovered.slice(0, 5).map((evidence) => (
            <div className="connectionLine" key={evidence.id}>
              <Link2 size={15} />
              <span>{evidence.title}</span>
            </div>
          ))}
        </div>
        <div className="boardColumn">
          <h3>Ключевые улики</h3>
          {discovered.filter((evidence) => evidence.priority === 'critical').map((evidence) => (
            <div className="pinCard evidencePin" key={evidence.id}>
              <strong>{evidence.title}</strong>
              <span>{evidence.summary}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="noteBox">
        <textarea
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="Запишите гипотезу: кто, зачем и каким образом исказил дело?"
          value={noteText}
        />
        <button
          className="primaryButton"
          onClick={() => {
            addNote(noteText);
            setNoteText('');
          }}
        >
          <Send size={18} />
          Сохранить гипотезу
        </button>
      </div>

      {notes.map((note) => (
        <article className="card noteCard" key={note.id}>
          <p>{note.text}</p>
          <span>{note.createdAt}</span>
        </article>
      ))}
    </section>
  );
}
