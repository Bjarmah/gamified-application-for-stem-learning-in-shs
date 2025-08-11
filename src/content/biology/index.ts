import module1 from './module1.json';
import module2 from './module2.json';
import module3 from './module3.json';

export type StructuredModule = unknown;

const mapByTitle: Record<string, StructuredModule> = {
  'Cell Structure & Function': module1,
  'Photosynthesis & Respiration': module2,
  'Human Body Systems': module3,
};

export function findBiologyModuleByTitle(title?: string | null): StructuredModule | null {
  if (!title) return null;
  const key = title.trim().toLowerCase();
  for (const [t, mod] of Object.entries(mapByTitle)) {
    if (t.toLowerCase() === key) return mod;
  }
  return null;
}
