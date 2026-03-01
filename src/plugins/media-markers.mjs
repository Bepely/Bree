/**
 * Remark plugin: media-markers
 * Transforms [illustration: date/record_id] markers into <img> elements.
 * Handles markers on their own line OR inline at end of paragraphs.
 */
import { visit } from "unist-util-visit";

const MARKER_RE = /^\[illustration:\s*(.+?)\]$/;
const INLINE_MARKER_RE = /\[illustration:\s*(.+?)\]/g;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(value) {
  const escaped = escapeHtml(value.trim());
  return [
    '<div class="media-illustration">',
    `  <img src="/illustrations/bree/${escaped}.webp" alt="" loading="lazy" />`,
    '</div>',
  ].join("\n");
}

export default function remarkMediaMarkers() {
  return (tree) => {
    const mutations = [];

    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index == null) return;

      // Simple case: paragraph with a single text child that IS the marker
      if (node.children.length === 1 && node.children[0].type === "text") {
        const text = node.children[0].value.trim();
        const match = text.match(MARKER_RE);
        if (match) {
          const html = buildHtml(match[1]);
          mutations.push({ parent, index, replacements: [{ type: "html", value: html }] });
          return;
        }
      }

      // Complex case: markers mixed with text (inline or on adjacent lines)
      if (!hasMarkers(node)) return;
      const replacements = splitParagraph(node);
      if (replacements.length > 0) {
        mutations.push({ parent, index, replacements });
      }
    });

    // Apply in reverse
    for (let i = mutations.length - 1; i >= 0; i--) {
      const { parent, index, replacements } = mutations[i];
      parent.children.splice(index, 1, ...replacements);
    }
  };
}

function hasMarkers(node) {
  for (const child of node.children) {
    if (child.type === "text" && INLINE_MARKER_RE.test(child.value)) {
      INLINE_MARKER_RE.lastIndex = 0; // reset regex state
      return true;
    }
  }
  return false;
}

function splitParagraph(node) {
  const replacements = [];
  let pendingChildren = [];

  function flushParagraph() {
    if (pendingChildren.length === 0) return;
    // Trim leading/trailing whitespace from first/last text nodes
    const first = pendingChildren[0];
    if (first.type === "text") first.value = first.value.replace(/^\s+/, "");
    const last = pendingChildren[pendingChildren.length - 1];
    if (last.type === "text") last.value = last.value.replace(/\s+$/, "");
    // Drop if only empty text remains
    const hasContent = pendingChildren.some(
      (c) => c.type !== "text" || c.value.trim() !== ""
    );
    if (hasContent) {
      replacements.push({ type: "paragraph", children: [...pendingChildren] });
    }
    pendingChildren = [];
  }

  for (const child of node.children) {
    if (child.type !== "text") {
      pendingChildren.push(child);
      continue;
    }

    // Split this text node around any [illustration: ...] markers
    let text = child.value;
    let lastIndex = 0;
    INLINE_MARKER_RE.lastIndex = 0;

    let match;
    while ((match = INLINE_MARKER_RE.exec(text)) !== null) {
      // Text before the marker
      const before = text.slice(lastIndex, match.index);
      if (before) {
        pendingChildren.push({ type: "text", value: before });
      }

      // Flush any accumulated text as a paragraph, then emit the illustration
      flushParagraph();
      replacements.push({ type: "html", value: buildHtml(match[1]) });

      lastIndex = INLINE_MARKER_RE.lastIndex;
    }

    // Remaining text after last marker
    const remaining = text.slice(lastIndex);
    if (remaining) {
      pendingChildren.push({ type: "text", value: remaining });
    }
  }

  flushParagraph();
  return replacements;
}
