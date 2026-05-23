export type TimelineEvent = {
  id: string;
  stage: number;
  date: string;
  time: string;
  title: string;
  description: string;
  certainty: 'confirmed' | 'disputed' | 'hidden' | 'unknown';
  relatedEvidenceIds: string[];
  relatedSuspectIds: string[];
  revealRequirement?: {
    discoveredEvidenceIds?: string[];
    stage?: number;
  };
};
