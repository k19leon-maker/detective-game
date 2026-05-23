import { useEffect, useMemo, useState } from 'react';
import { Lock, Unlock, Send } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { caseInfo, evidenceList, suspects } from './data/gameData';
import type { PlayerNote, Screen } from './types/game';

function getTelegramUserName() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!user) return 'Детектив';
  return user.first_name || user.username || 'Детектив';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [noteText, setNoteText] = useState('');

  const playerName = useMemo(() => getTelegramUserName(), []);

  useEffect(() => {
    window.Telegram?.WebApp?.ready();
    window.Telegram?.WebApp?.expand();
  }, []);

  function addNote() {
    const text = noteText.trim();
    if (!text) return;

    setNotes((current) => [
      {
        id: crypto.randomUUID(),
        text,
        createdAt: new Date().toLocaleString('ru-RU'),
      },
      ...current,
    ]);

    setNoteText('');
  }

  return (
    <div className="app">
      <Header />

      <main className="content">
        {screen === 'intro' && (
          <section className="card hero">
            <p className="eyebrow">Добро пожаловать</p>
            <h2>{playerName}, вы вошли в базу расследования</h2>
            <p>{caseInfo.description}</p>
            <button className="primaryButton" onClick={() => setScreen('case')}>
              Открыть дело
            </button>
          </section>
        )}

        {screen === 'case' && (
          <section className="stack">
            <div className="card">
              <p className="eyebrow">Основное дело</p>
              <h2>{caseInfo.title}</h2>
              <p>
                Здесь будет главный экран дела: завязка, правила, хронология,
                вводные данные и текущая задача игроков.
              </p>
            </div>

            <div className="card">
              <h3>Статус игры</h3>
              <div className="statusGrid">
                <div>
                  <strong>Этап</strong>
                  <span>Подготовка</span>
                </div>
                <div>
                  <strong>Улик</strong>
                  <span>{evidenceList.length}</span>
                </div>
                <div>
                  <strong>Персонажей</strong>
                  <span>{suspects.length}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {screen === 'evidence' && (
          <section className="stack">
            <div className="sectionTitle">
              <h2>Улики</h2>
              <p>Позже сюда можно добавить PDF, фото, аудио, таймеры и закрытые конверты.</p>
            </div>

            {evidenceList.map((evidence) => (
              <article key={evidence.id} className="card listCard">
                <div>
                  <h3>{evidence.title}</h3>
                  <p>{evidence.description}</p>
                  <span className="tag">{evidence.type}</span>
                </div>
                <div className={evidence.isLocked ? 'lock locked' : 'lock unlocked'}>
                  {evidence.isLocked ? <Lock size={22} /> : <Unlock size={22} />}
                </div>
              </article>
            ))}
          </section>
        )}

        {screen === 'suspects' && (
          <section className="stack">
            <div className="sectionTitle">
              <h2>Персонажи</h2>
              <p>Карточки людей, связанных с делом.</p>
            </div>

            {suspects.map((suspect) => (
              <article key={suspect.id} className="card suspectCard">
                <div className="avatar">{suspect.name.slice(-1)}</div>
                <div>
                  <h3>{suspect.name}</h3>
                  <span className="tag">{suspect.role}</span>
                  <p>{suspect.shortDescription}</p>
                </div>
              </article>
            ))}
          </section>
        )}

        {screen === 'notes' && (
          <section className="stack">
            <div className="sectionTitle">
              <h2>Заметки детектива</h2>
              <p>Игрок может фиксировать гипотезы прямо внутри мини-приложения.</p>
            </div>

            <div className="noteBox">
              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Напишите версию, подозрение или важную деталь..."
              />
              <button className="primaryButton" onClick={addNote}>
                <Send size={18} />
                Сохранить заметку
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="emptyState">Пока заметок нет.</div>
            ) : (
              notes.map((note) => (
                <article key={note.id} className="card">
                  <p>{note.text}</p>
                  <span className="date">{note.createdAt}</span>
                </article>
              ))
            )}
          </section>
        )}
      </main>

      <BottomNav currentScreen={screen} onChange={setScreen} />
    </div>
  );
}
