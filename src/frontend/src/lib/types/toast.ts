export type ToastLevel = 'success' | 'error' | 'info' | 'warning';

export interface ToastMsg {
  id : number;
  text: string;
  level: ToastLevel;
  duration?: number;
  detail?: string;
}
