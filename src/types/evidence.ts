export type EvidenceType = 'document' | 'photo' | 'audio' | 'message' | 'object' | 'interrogation';

export type EvidencePriority = 'low' | 'medium' | 'high' | 'critical';

export type Evidence = {
  id: string;
  title: string;
  type: EvidenceType;
  priority: EvidencePriority;
  stage: number;
  timeLabel?: string;
  source: string;
  summary: string;
  content: string;
  tags: string[];
  unlockRequirement?: {
    discoveredEvidenceIds?: string[];
    discoveredCount?: number;
    stage?: number;
  };
  relatedSuspectIds: string[];
  contradictionIds?: string[];
};
