import type { Evidence, Suspect } from '../types/game';

export const caseInfo = {
  title: 'Дело Дэвида Хантера',
  subtitle: 'База детективной игры',
  description:
    'Это черновая база Telegram Mini App. Здесь позже появятся сценарий, улики, персонажи, правила и финальная развязка.',
};

export const evidenceList: Evidence[] = [
  {
    id: 'evidence-1',
    title: 'Досье дела',
    type: 'document',
    isLocked: false,
    description: 'Основное описание дела. Пока используется как заглушка.',
  },
  {
    id: 'evidence-2',
    title: 'Фотографии персонажей',
    type: 'photo',
    isLocked: false,
    description: 'Раздел для визуальных материалов по подозреваемым.',
  },
  {
    id: 'evidence-3',
    title: 'Финальный конверт',
    type: 'document',
    isLocked: true,
    description: 'Этот раздел должен открываться только после завершения игры.',
  },
];

export const suspects: Suspect[] = [
  {
    id: 'suspect-1',
    name: 'Персонаж 1',
    role: 'Подозреваемый',
    shortDescription: 'Краткое описание персонажа будет добавлено позже.',
  },
  {
    id: 'suspect-2',
    name: 'Персонаж 2',
    role: 'Свидетель',
    shortDescription: 'Краткое описание персонажа будет добавлено позже.',
  },
  {
    id: 'suspect-3',
    name: 'Персонаж 3',
    role: 'Связанное лицо',
    shortDescription: 'Краткое описание персонажа будет добавлено позже.',
  },
];
