import type { EvidencePriority, EvidenceType } from '../types/evidence';

export function evidenceTypeLabel(type: EvidenceType) {
  const labels: Record<EvidenceType, string> = {
    audio: 'Аудио',
    document: 'Документ',
    interrogation: 'Допрос',
    message: 'Переписка',
    object: 'Объект',
    photo: 'Фото',
  };
  return labels[type];
}

export function priorityLabel(priority: EvidencePriority) {
  const labels: Record<EvidencePriority, string> = {
    critical: 'критично',
    high: 'важно',
    low: 'низкий',
    medium: 'средний',
  };
  return labels[priority];
}

export function certaintyLabel(certainty: string) {
  if (certainty === 'confirmed') return 'подтверждено';
  if (certainty === 'disputed') return 'спорно';
  if (certainty === 'hidden') return 'скрыто';
  return 'неизвестно';
}
