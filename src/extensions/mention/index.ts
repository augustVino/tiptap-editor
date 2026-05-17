import Mention from '@tiptap/extension-mention';
import type { JSONContent } from '@tiptap/core';
import type { MentionConfig } from './types';
import { createMentionConfigure } from './configure';

const registeredNames = new Map<string, boolean>();

export function createMentionExtension(config: MentionConfig) {
  if (config.trigger.length !== 1) {
    throw new Error(
      `[createMentionExtension] trigger must be a single character, got "${config.trigger}"`,
    );
  }

  if (registeredNames.get(config.name)) {
    console.warn(
      `[createMentionExtension] Duplicate name "${config.name}"`,
    );
  }
  registeredNames.set(config.name, true);

  const configure = createMentionConfigure(config);

  return Mention.extend({
    name: config.name,
  }).configure(configure as any);
}

export function getMentionSourceFromJSON(
  json: JSONContent,
  mentionName: string,
): unknown {
  const findNode = (node: JSONContent): any => {
    if (node.type === mentionName) return node.attrs?.mentionSource ?? null;
    if (node.content) {
      for (const child of node.content) {
        const found = findNode(child);
        if (found) return found;
      }
    }
    return null;
  };
  return findNode(json);
}

export { withMentionInteraction } from './withMentionInteraction';
export { NodeViewWrapper } from '@tiptap/react';
export type { MentionItem, MentionListProps, MentionConfig } from './types';
