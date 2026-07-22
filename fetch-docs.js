import 'dotenv/config';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const CONTENT_TYPE_UID = 'docs_article';
const JSON_DIR = 'json';
const DOCS_DIR = 'docs';

const { STACK_API_KEY, STACK_DELIVERY_TOKEN, STACK_ENVIRONMENT } = process.env;

if (!STACK_API_KEY || !STACK_DELIVERY_TOKEN || !STACK_ENVIRONMENT) {
  throw new Error(
    'Missing STACK_API_KEY, STACK_DELIVERY_TOKEN, or STACK_ENVIRONMENT in .env'
  );
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});
turndownService.use(gfm);
function decodeHtmlEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

turndownService.addRule('barePre', {
  filter: (node) => node.nodeName === 'PRE' && !node.querySelector('code'),
  replacement: (content, node) => {
    const withNewlines = node.innerHTML
      .replace(/<br\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '');
    const code = decodeHtmlEntities(withNewlines).trim();
    return `\n\`\`\`\n${code}\n\`\`\`\n`;
  },
});

function slugFromUrl(url) {
  const segments = url.split('/').filter(Boolean);
  return segments[segments.length - 1];
}

function yamlString(value) {
  return `"${String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

async function fetchEntry(uid) {
  const apiUrl =
    `https://cdn.contentstack.io/v3/content_types/${CONTENT_TYPE_UID}/entries/${uid}` +
    `?environment=${STACK_ENVIRONMENT}`;

  const response = await fetch(apiUrl, {
    headers: {
      api_key: STACK_API_KEY,
      access_token: STACK_DELIVERY_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch entry ${uid}: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.entry;
}

function buildMarkdown(entry) {
  const articleSectionBlocks = (entry.article_content || []).filter(
    (block) => 'article_section' in block
  );

  if (articleSectionBlocks.length === 0) {
    throw new Error(`Entry ${entry.uid} has no "article_section" block`);
  }
  if (articleSectionBlocks.length > 1) {
    console.warn(
      `Warning: entry ${entry.uid} has ${articleSectionBlocks.length} "article_section" blocks, using the first one`
    );
  }

  const { heading, content } = articleSectionBlocks[0].article_section;
  const bodyMarkdown = turndownService.turndown(content || '');

  const frontMatter = [
    '---',
    `uid: ${yamlString(entry.uid)}`,
    `url: ${yamlString(entry.url)}`,
    `seo_title: ${yamlString(entry.seo?.title)}`,
    `seo_description: ${yamlString(entry.seo?.description)}`,
    '---',
    '',
  ].join('\n');

  return `${frontMatter}\n# ${heading}\n\n${bodyMarkdown}\n`;
}

async function main() {
  await mkdir(JSON_DIR, { recursive: true });
  await mkdir(DOCS_DIR, { recursive: true });

  const entries = JSON.parse(await readFile('entries.json', 'utf-8'));

  for (const { uid } of entries) {
    console.log(`Fetching ${uid}...`);
    const entry = await fetchEntry(uid);
    const slug = slugFromUrl(entry.url);

    const jsonPath = `${JSON_DIR}/${slug}.json`;
    await writeFile(jsonPath, JSON.stringify(entry, null, 2));
    console.log(`  Wrote ${jsonPath}`);

    const markdown = buildMarkdown(entry);
    const mdPath = `${DOCS_DIR}/${slug}.md`;
    await writeFile(mdPath, markdown);
    console.log(`  Wrote ${mdPath}`);
  }

  console.log(`Done. Processed ${entries.length} entries.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
