export type SuspicionLevel = 1 | 2 | 3 | 4 | 5;

export type Suspect = {
  id: string;
  name: string;
  role: string;
  status: 'victim' | 'suspect' | 'witness' | 'authority' | 'unknown';
  avatarInitials: string;
  shortDescription: string;
  profile: string;
  motive: string;
  alibi: string;
  contradictions: string[];
  knownSecrets: string[];
  suspicionLevel: SuspicionLevel;
  connectionIds: string[];
};
