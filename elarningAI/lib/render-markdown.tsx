import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import type { Root as HastRoot } from 'hast';

export async function renderMarkdown(content: string): Promise<React.ReactNode> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false });

  const mdast = processor.parse(content);
  const hast = await processor.run(mdast);

  return toJsxRuntime(hast as HastRoot, {
    Fragment,
    jsx: jsx as Parameters<typeof toJsxRuntime>[1]['jsx'],
    jsxs: jsxs as Parameters<typeof toJsxRuntime>[1]['jsxs'],
    development: false,
  });
}
