import { createContext, useContext, useMemo, useState } from 'react';
import { evidenceList, finalSolution, stages } from '../data/gameData';
import type { Evidence } from '../types/evidence';
import type { FinalAccusation, PlayerNote } from '../types/theory';
import type { GameState } from '../types/progression';

type GameContextValue = {
  accusationResult: 'correct' | 'wrong' | null;
  addNote: (text: string) => void;
  askSarahQuestion: (id: string) => void;
  availableEvidence: Evidence[];
  discoveredEvidence: Evidence[];
  discoverEvidence: (id: string) => void;
  finalAccusation: FinalAccusation | null;
  getEvidenceStatus: (evidence: Evidence) => 'available' | 'locked' | 'discovered';
  hasAskedSarahQuestion: (id: string) => boolean;
  hasInspectedSceneItem: (id: string) => boolean;
  inspectSceneItem: (id: string) => void;
  isSarahInterrogationUnlocked: boolean;
  isTwistUnlocked: boolean;
  isEvidenceUnlocked: (evidence: Evidence) => boolean;
  notes: PlayerNote[];
  playTwist: () => void;
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
    askedQuestionIds: [],
    discoveredEvidenceIds: initialDiscovered,
    finalAccusationSubmitted: false,
    inspectedSceneItemIds: [],
    solvedClueIds: [],
    suspicionLevels: {},
    twistPlayed: false,
  });
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [finalAccusation, setFinalAccusation] = useState<FinalAccusation | null>(null);
  const [accusationResult, setAccusationResult] = useState<'correct' | 'wrong' | null>(null);

  const currentStage = calculateStage(state.discoveredEvidenceIds.length);

  const value = useMemo<GameContextValue>(() => {
    const normalizedState = { ...state, currentStage };
    const discoveredEvidence = evidenceList.filter((evidence) => state.discoveredEvidenceIds.includes(evidence.id));
    const availableEvidence = evidenceList.filter((evidence) => isEvidenceUnlockedByState(evidence, normalizedState));
    const isSarahInterrogationUnlocked =
      state.inspectedSceneItemIds.includes('clock') &&
      state.discoveredEvidenceIds.includes('case-file') &&
      state.discoveredEvidenceIds.includes('msg-warning');
    const isTwistUnlocked =
      state.askedQuestionIds.includes('time-mismatch') &&
      state.askedQuestionIds.includes('room-314') &&
      state.discoveredEvidenceIds.includes('msg-warning');

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

    function inspectSceneItem(id: string) {
      setState((current) => {
        const inspectedSceneItemIds = current.inspectedSceneItemIds.includes(id)
          ? current.inspectedSceneItemIds
          : [...current.inspectedSceneItemIds, id];
        const discoveredEvidenceIds = id === 'clock' || id === 'phone' || id === 'glass'
          ? unique([...current.discoveredEvidenceIds, 'scene-photo'])
          : current.discoveredEvidenceIds;
        return {
          ...current,
          currentStage: calculateStage(discoveredEvidenceIds.length),
          discoveredEvidenceIds,
          inspectedSceneItemIds,
        };
      });
    }

    function askSarahQuestion(id: string) {
      setState((current) => {
        const askedQuestionIds = current.askedQuestionIds.includes(id)
          ? current.askedQuestionIds
          : [...current.askedQuestionIds, id];
        const nextAskedQuestionIds = current.askedQuestionIds.includes(id) ? current.askedQuestionIds : [...current.askedQuestionIds, id];
        const shouldUnlockTape = nextAskedQuestionIds.includes('time-mismatch') && nextAskedQuestionIds.includes('room-314');
        const discoveredEvidenceIds = shouldUnlockTape
          ? unique([...current.discoveredEvidenceIds, 'mark-tape-after-death'])
          : current.discoveredEvidenceIds;
        const solvedClueIds = shouldUnlockTape
          ? unique([...current.solvedClueIds, 'sarah-time-collapse'])
          : current.solvedClueIds;
        return {
          ...current,
          askedQuestionIds,
          currentStage: calculateStage(discoveredEvidenceIds.length),
          discoveredEvidenceIds,
          solvedClueIds,
          suspicionLevels: {
            ...current.suspicionLevels,
            'sarah-miller': Math.min(100, (current.suspicionLevels['sarah-miller'] ?? 42) + 8),
          },
        };
      });
    }

    function playTwist() {
      setState((current) => (current.twistPlayed ? current : { ...current, twistPlayed: true }));
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
      askSarahQuestion,
      availableEvidence,
      discoveredEvidence,
      discoverEvidence,
      finalAccusation,
      getEvidenceStatus: (evidence) => {
        if (state.discoveredEvidenceIds.includes(evidence.id)) return 'discovered';
        return isEvidenceUnlockedByState(evidence, normalizedState) ? 'available' : 'locked';
      },
      hasAskedSarahQuestion: (id) => state.askedQuestionIds.includes(id),
      hasInspectedSceneItem: (id) => state.inspectedSceneItemIds.includes(id),
      inspectSceneItem,
      isSarahInterrogationUnlocked,
      isTwistUnlocked,
      isEvidenceUnlocked: (evidence) => isEvidenceUnlockedByState(evidence, normalizedState),
      notes,
      playTwist,
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
  if (evidence.id === 'mark-tape-after-death' && !state.solvedClueIds.includes('sarah-time-collapse')) return false;
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

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}
