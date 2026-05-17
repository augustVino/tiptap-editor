import Mention from '@tiptap/extension-mention';
import type { JSONContent } from '@tiptap/core';
import type { MentionConfig } from './types';
import { createMentionConfigure, MENTION_SOURCE_ATTR } from './configure';

export function createMentionExtension(config: MentionConfig) {
  if (config.trigger.length !== 1) {
    throw new Error(
      `[createMentionExtension] trigger must be a single character, got "${config.trigger}"`,
    );
  }

  const { configOptions, extensionMethods } = createMentionConfigure(config);

  return Mention.extend({
    name: config.name,
    ...extensionMethods,
  }).configure(configOptions);
}

export function getAllMentionSourcesFromJSON(
  json: JSONContent,
  mentionName: string,
): unknown[] {
  const results: unknown[] = [];
  const collect = (node: JSONContent) => {
    if (node.type === mentionName && node.attrs?.[MENTION_SOURCE_ATTR] != null) {
      results.push(node.attrs[MENTION_SOURCE_ATTR]);
    }
    node.content?.forEach(collect);
  };
  collect(json);
  return results;
}

export function getMentionSourceFromJSON(
  json: JSONContent,
  mentionName: string,
): unknown {
  if (json.type === mentionName && json.attrs?.[MENTION_SOURCE_ATTR] != null) {
    return json.attrs[MENTION_SOURCE_ATTR];
  }
  if (json.content) {
    for (const child of json.content) {
      const found = getMentionSourceFromJSON(child, mentionName);
      if (found != null) return found;
    }
  }
  return null;
}

export { withMentionInteraction } from './withMentionInteraction';
export { NodeViewWrapper } from '@tiptap/react';
export type { MentionItem, MentionListProps, MentionConfig, MentionTippyOptions } from './types';
