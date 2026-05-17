import { Editor } from '@tiptap/core';
import FileHandler from '@tiptap/extension-file-handler';

export interface FileHandlerConfig {
  allowedMimeTypes?: string[];
  onRejected?: (files: File[]) => void;
  onPaste?: (editor: Editor, files: File[], htmlContent?: string) => void;
  onDrop?: (editor: Editor, files: File[], pos: number) => void;
}

export function isMimeTypeAllowed(file: File, allowed?: string[]): boolean {
  if (!allowed || allowed.length === 0) return true;
  return allowed.some((pattern) => {
    if (pattern.endsWith('/*')) {
      return file.type.startsWith(pattern.slice(0, -1));
    }
    return pattern === file.type;
  });
}

export function partitionFiles(files: File[], allowedMimeTypes?: string[]) {
  const allowed: File[] = [];
  const rejected: File[] = [];
  for (const f of files) {
    if (isMimeTypeAllowed(f, allowedMimeTypes)) {
      allowed.push(f);
    } else {
      rejected.push(f);
    }
  }
  return { allowed, rejected };
}

function dispatchFiles(
  files: File[],
  allowedMimeTypes: string[] | undefined,
  onRejected: FileHandlerConfig['onRejected'],
  onAllowed: (allowed: File[]) => void,
) {
  const { allowed, rejected } = partitionFiles(files, allowedMimeTypes);
  if (rejected.length > 0) onRejected?.(rejected);
  if (allowed.length > 0) onAllowed(allowed);
}

export function createFileHandlerExtension(config: FileHandlerConfig) {
  const { allowedMimeTypes, onRejected, onPaste, onDrop } = config;

  return FileHandler.configure({
    onPaste: (editor, files, htmlContent) => {
      dispatchFiles(files, allowedMimeTypes, onRejected, (allowed) => {
        onPaste?.(editor, allowed, htmlContent ?? undefined);
      });
    },
    onDrop: (editor, files, pos) => {
      dispatchFiles(files, allowedMimeTypes, onRejected, (allowed) => {
        onDrop?.(editor, allowed, pos);
      });
    },
  });
}
