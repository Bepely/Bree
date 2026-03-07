/**
 * Remark plugin: media-markers
 *
 * 1. Wraps <audio>/<video> + following blockquote into .record-block
 *    containers with collapsible transcripts.
 * 2. Legacy: transforms [illustration: date/record_id] markers into <img>.
 */
import { visit } from "unist-util-visit";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";

// --- Legacy illustration support ---
const MARKER_RE = /^\[illustration:\s*(.+?)\]$/;
const INLINE_MARKER_RE = /\[illustration:\s*(.+?)\]/g;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildIllustrationHtml(value) {
  const escaped = escapeHtml(value.trim());
  return [
    '<div class="media-illustration">',
    `  <img src="/illustrations/bepely/${escaped}.webp" alt="" loading="lazy" />`,
    "</div>",
  ].join("\n");
}

// --- Record block detection ---
const AUDIO_RE = /<audio\b/i;
const VIDEO_RE = /<video\b/i;

function isMediaValue(value) {
  return AUDIO_RE.test(value) || VIDEO_RE.test(value);
}

/**
 * Convert a blockquote mdast node to HTML string.
 */
function blockquoteToHtml(node) {
  const hast = toHast(node, { allowDangerousHtml: true });
  return toHtml(hast, { allowDangerousHtml: true });
}

/**
 * Find paragraphs that are essentially just an <audio>/<video> element.
 */
function findMediaParagraphs(tree) {
  const results = [];

  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];

    // Case 1: standalone html node at root level
    if (node.type === "html" && isMediaValue(node.value)) {
      results.push({ index: i, mediaHtml: node.value });
      continue;
    }

    // Case 2: paragraph containing html nodes for audio/video
    if (node.type !== "paragraph") continue;

    const htmlChildren = node.children.filter((c) => c.type === "html");
    const textChildren = node.children.filter((c) => c.type === "text");
    const otherChildren = node.children.filter(
      (c) => c.type !== "html" && c.type !== "text"
    );

    if (htmlChildren.length === 0) continue;
    if (otherChildren.length > 0) continue;
    if (textChildren.some((c) => c.value.trim() !== "")) continue;

    const hasMedia = htmlChildren.some((c) => isMediaValue(c.value));
    if (!hasMedia) continue;

    const mediaHtml = htmlChildren.map((c) => c.value).join("");
    results.push({ index: i, mediaHtml });
  }

  return results;
}

export default function remarkMediaMarkers() {
  return (tree) => {
    wrapRecordBlocks(tree);
    transformIllustrations(tree);
  };
}

function wrapRecordBlocks(tree) {
  const mediaNodes = findMediaParagraphs(tree);
  for (let i = mediaNodes.length - 1; i >= 0; i--) {
    const { index, mediaHtml } = mediaNodes[i];
    const next = tree.children[index + 1];
    const hasTranscript = next && next.type === "blockquote";
    const count = hasTranscript ? 2 : 1;

    let html;

    if (hasTranscript) {
      const bqHtml = blockquoteToHtml(next);
      html = [
        '<div class="record-block">',
        mediaHtml,
        '<details class="record-transcript">',
        "<summary>Transcript</summary>",
        bqHtml,
        "</details>",
        "</div>",
      ].join("\n");
    } else {
      html = `<div class="record-block">\n${mediaHtml}\n</div>`;
    }

    tree.children.splice(index, count, { type: "html", value: html });
  }
}

// --- Legacy illustration marker transform ---
function transformIllustrations(tree) {
  const mutations = [];

  visit(tree, "paragraph", (node, index, parent) => {
    if (!parent || index == null) return;

    if (node.children.length === 1 && node.children[0].type === "text") {
      const text = node.children[0].value.trim();
      const match = text.match(MARKER_RE);
      if (match) {
        const html = buildIllustrationHtml(match[1]);
        mutations.push({
          parent,
          index,
          replacements: [{ type: "html", value: html }],
        });
        return;
      }
    }

    if (!hasMarkers(node)) return;
    const replacements = splitParagraph(node);
    if (replacements.length > 0) {
      mutations.push({ parent, index, replacements });
    }
  });

  for (let i = mutations.length - 1; i >= 0; i--) {
    const { parent, index, replacements } = mutations[i];
    parent.children.splice(index, 1, ...replacements);
  }
}

function hasMarkers(node) {
  for (const child of node.children) {
    if (child.type === "text" && INLINE_MARKER_RE.test(child.value)) {
      INLINE_MARKER_RE.lastIndex = 0;
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
    const first = pendingChildren[0];
    if (first.type === "text") first.value = first.value.replace(/^\s+/, "");
    const last = pendingChildren[pendingChildren.length - 1];
    if (last.type === "text") last.value = last.value.replace(/\s+$/, "");
    const hasContent = pendingChildren.some(
      (c) => c.type !== "text" || c.value.trim() !== ""
    );
    if (hasContent) {
      replacements.push({
        type: "paragraph",
        children: [...pendingChildren],
      });
    }
    pendingChildren = [];
  }

  for (const child of node.children) {
    if (child.type !== "text") {
      pendingChildren.push(child);
      continue;
    }

    let text = child.value;
    let lastIndex = 0;
    INLINE_MARKER_RE.lastIndex = 0;

    let match;
    while ((match = INLINE_MARKER_RE.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) {
        pendingChildren.push({ type: "text", value: before });
      }
      flushParagraph();
      replacements.push({
        type: "html",
        value: buildIllustrationHtml(match[1]),
      });
      lastIndex = INLINE_MARKER_RE.lastIndex;
    }

    const remaining = text.slice(lastIndex);
    if (remaining) {
      pendingChildren.push({ type: "text", value: remaining });
    }
  }

  flushParagraph();
  return replacements;
}
