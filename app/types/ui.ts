// app/types/ui.ts
import type { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export type ColorScheme = 'light' | 'dark' | 'system';

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ModalConfig {
  isOpen: boolean;
  title?: string;
  content?: ReactNode;
  onClose?: () => void;
}