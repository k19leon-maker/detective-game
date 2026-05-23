export type TheoryConnection = {
  id: string;
  fromId: string;
  toId: string;
  label: string;
  strength: 'weak' | 'medium' | 'strong';
};

export type PlayerNote = {
  id: string;
  text: string;
  createdAt: string;
};

export type FinalAccusation = {
  suspectId: string;
  motive: string;
  chain: string[];
};
