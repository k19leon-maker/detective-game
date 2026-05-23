import { createContext, useContext, useMemo, useState } from 'react';
import { evidenceList, finalSolution, stages } from '../data/gameData';
import type { Evidence } from '../types/evidence';
import type { FinalAccusation, PlayerNote } from '../types/theory';
import type { GameState } from '../types/progression';

type GameContextValue = {
  accusationResult: 'correct' | 'wrong' | null;
  addNote: (text: string) => void;
  availableEvidence: Evidence[];
  discoveredEvidence: Evidence[];
  discoverEvidence: (id: string) => void;
  finalAccusation: FinalAccusation | null;
  getEvidenceStatus: (evidence: Evidence) => 'available' | 'locked' | 'discovered';
  isEvidenceUnlocked: (evidence: Evidence) => boolean;
  notes: PlayerNote[];
  progressPercent: number;
  setFinalAccusation: (accusation: FinalAccusation) => void;
  state: GameState;
  submitFinalAccusation: (accusation: FinalAccusation) => 'correct' | 'wrong';
};

const initialDiscovered = ['case-file'];

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    currentStage: 1,
    discoveredEvidenceIds: initialDiscovered,
    finalAccusationSubmitted: false,
    solvedClueIds: [],
    suspicionLevels: {},
  });
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [finalAccusation, setFinalAccusation] = useState<FinalAccusation | null>(null);
  const [accusationResult, setAccusationResult] = useState<'correct' | 'wrong' | null>(null);

  const currentStage = calculateStage(state.discoveredEvidenceIds.length);

  const value = useMemo<GameContextValue>(() => {
    const normalizedState = { ...state, currentStage };
    const discoveredEvidence = evidenceList.filter((evidence) => state.discoveredEvidenceIds.includes(evidence.id));
    const availableEvidence = evidenceList.filter((evidence) => isEvidenceUnlockedByState(evidence, normalizedState));

    function discoverEvidence(id: string) {
      setState((current) => {
        if (current.discoveredEvidenceIds.includes(id)) return current;
        const discoveredEvidenceIds = [...current.discoveredEvidenceIds, id];
        return {
          ...current,
          currentStage: calculateStage(discoveredEvidenceIds.length),
          discoveredEvidenceIds,
        };
      });
    }

    function addNote(text: string) {
      const trimmed = text.trim();
      if (!trimmed) return;
      setNotes((current) => [
        {
          createdAt: new Date().toLocaleString('ru-RU', { day: '2-digit', hour: '2-digit', minute: '2-digit', month: '2-digit' }),
          id: crypto.randomUUID(),
          text: trimmed,
        },
        ...current,
      ]);
    }

    function submitFinalAccusation(accusation: FinalAccusation) {
      const isCorrect =
        accusation.suspectId === finalSolution.killerId &&
        accusation.chain.filter((id) => finalSolution.chain.includes(id)).length >= 4 &&
        accusation.motive.length > 24;
      const result = isCorrect ? 'correct' : 'wrong';
      setFinalAccusation(accusation);
      setAccusationResult(result);
      setState((current) => ({ ...current, finalAccusationSubmitted: true }));
      return result;
    }

    return {
      accusationResult,
      addNote,
      availableEvidence,
      discoveredEvidence,
      discoverEvidence,
      finalAccusation,
      getEvidenceStatus: (evidence) => {
        if (state.discoveredEvidenceIds.includes(evidence.id)) return 'discovered';
        return isEvidenceUnlockedByState(evidence, normalizedState) ? 'available' : 'locked';
      },
      isEvidenceUnlocked: (evidence) => isEvidenceUnlockedByState(evidence, normalizedState),
      notes,
      progressPercent: Math.round((state.discoveredEvidenceIds.length / evidenceList.length) * 100),
      setFinalAccusation,
      state: normalizedState,
      submitFinalAccusation,
    };
  }, [accusationResult, currentStage, finalAccusation, notes, state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
}

function isEvidenceUnlockedByState(evidence: Evidence, state: GameState) {
  const requirement = evidence.unlockRequirement;
  if (!requirement) return true;
  if (requirement.stage && state.currentStage < requirement.stage) return false;
  if (requirement.discoveredCount && state.discoveredEvidenceIds.length < requirement.discoveredCount) return false;
  if (requirement.discoveredEvidenceIds?.some((id) => !state.discoveredEvidenceIds.includes(id))) return false;
  return true;
}

function calculateStage(discoveredCount: number) {
  const stage = stages.reduce((result, item) => (discoveredCount >= item.requiredDiscoveries ? item.id : result), 1);
  return Math.min(stage, 6);
}
