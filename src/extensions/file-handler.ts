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

export function createFileHandlerExtension(config: FileHandlerConfig) {
  const { allowedMimeTypes, onRejected, onPaste, onDrop } = config;

  return FileHandler.configure({
    onPaste: (editor, files, htmlContent) => {
      const allowed = files.filter((f) => isMimeTypeAllowed(f, allowedMimeTypes));
      const rejected = files.filter((f) => !isMimeTypeAllowed(f, allowedMimeTypes));

      if (rejected.length > 0) {
        onRejected?.(rejected);
      }

      if (allowed.length > 0) {
        onPaste?.(editor, allowed, htmlContent ?? undefined);
      }
    },
    onDrop: (editor, files, pos) => {
      const allowed = files.filter((f) => isMimeTypeAllowed(f, allowedMimeTypes));
      const rejected = files.filter((f) => !isMimeTypeAllowed(f, allowedMimeTypes));

      if (rejected.length > 0) {
        onRejected?.(rejected);
      }

      if (allowed.length > 0) {
        onDrop?.(editor, allowed, pos);
      }
    },
  });
}
