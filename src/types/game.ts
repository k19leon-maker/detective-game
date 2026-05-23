export type Screen = 'intro' | 'case' | 'evidence' | 'suspects' | 'notes' | 'final';

export type Evidence = {
  id: string;
  title: string;
  type: 'document' | 'photo' | 'audio' | 'object';
  isLocked: boolean;
  description: string;
};

export type Suspect = {
  id: string;
  name: string;
  role: string;
  shortDescription: string;
};

export type PlayerNote = {
  id: string;
  text: string;
  createdAt: string;
};
