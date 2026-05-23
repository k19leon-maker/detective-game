import type { Suspect } from '../types/suspect';

type Props = {
  className?: string;
  suspect: Suspect;
};

export function SuspectAvatar({ className = '', suspect }: Props) {
  if (suspect.images?.main) {
    return (
      <figure className={`suspectPhoto ${className}`}>
        <img alt={suspect.name} src={suspect.images.main} />
      </figure>
    );
  }

  return <div className={`avatar ${className}`}>{suspect.avatarInitials}</div>;
}
