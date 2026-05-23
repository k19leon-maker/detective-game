export type InvestigationStage = {
  id: number;
  title: string;
  label: string;
  description: string;
  objective: string;
  requiredDiscoveries: number;
};

export type GameState = {
  currentStage: number;
  discoveredEvidenceIds: string[];
  solvedClueIds: string[];
  suspicionLevels: Record<string, number>;
  finalAccusationSubmitted: boolean;
};

export type Screen =
  | 'home'
  | 'case'
  | 'evidence'
  | 'evidence-detail'
  | 'suspects'
  | 'suspect-detail'
  | 'timeline'
  | 'theory'
  | 'progress'
  | 'final';
