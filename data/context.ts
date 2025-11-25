import fs from 'fs';
import path from 'path';

export type DocEntry = {
  id: string;
  content: string;
  source: string;
};

export function loadContextEntries(): DocEntry[] {
  const dataDir = path.join(process.cwd(), 'data');
  const entries: DocEntry[] = [];

  const collect = (dir: string, prefix: string) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      entries.push({
        id: `${prefix}/${file}`,
        content,
        source: `${prefix}/${file}`,
      });
    });
  };

  collect(path.join(dataDir, 'markdown/background'), 'background');
  collect(path.join(dataDir, 'markdown/projects/categories'), 'projects');
  collect(path.join(dataDir, 'markdown/projects/detail'), 'projects');

  return entries;
}

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/gi)
    .filter(Boolean);

export function keywordSimilarity(
  query: string,
  entries: DocEntry[],
  topK = 3
): DocEntry[] {
  const queryTokens = new Set(tokenize(query));
  if (!queryTokens.size) return entries.slice(0, Math.min(topK, entries.length));

  const scored = entries
    .map((entry) => {
      const tokens = new Set(tokenize(entry.content));
      let overlap = 0;
      queryTokens.forEach((t) => {
        if (tokens.has(t)) overlap += 1;
      });
      return { entry, score: overlap };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.entry);

  if (!scored.length) {
    return entries.slice(0, Math.min(topK, entries.length));
  }
  return scored;
}
