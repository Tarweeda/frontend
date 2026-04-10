const ICONS: Record<string, string[]> = {
  grid: [
    'M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z',
  ],
  package: [
    'M16.5 9.4l-9-5.19',
    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
    'M3.27 6.96L12 12.01l8.73-5.05', 'M12 22.08V12',
  ],
  'shopping-bag': [
    'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z',
    'M3 6h18', 'M16 10a4 4 0 01-8 0',
  ],
  calendar: [
    'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z',
    'M16 2v4', 'M8 2v4', 'M3 10h18',
  ],
  clipboard: [
    'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2',
    'M9 2h6a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z',
  ],
  utensils: [
    'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2', 'M7 2v20',
    'M21 15V2l-4 4-4-4v13a4 4 0 004 4h0a4 4 0 004-4z',
  ],
  users: [
    'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
    'M9 11a4 4 0 100-8 4 4 0 000 8z',
    'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75',
  ],
  layers: [
    'M12 2L2 7l10 5 10-5-10-5z',
    'M2 17l10 5 10-5',
    'M2 12l10 5 10-5',
  ],
  gift: [
    'M20 12v10H4V12', 'M2 7h20v5H2z', 'M12 22V7',
    'M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z',
    'M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z',
  ],
};

interface Props {
  name: string;
  size?: number;
}

export function AdminIcon({ name, size = 18 }: Props) {
  const paths = ICONS[name];
  if (!paths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
