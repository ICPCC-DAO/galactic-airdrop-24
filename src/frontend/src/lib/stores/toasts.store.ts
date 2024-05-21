import type { ToastMsg } from '$lib/types/toast';
import { errorDetailToString } from '$lib/utils/error.utils';
import { writable } from 'svelte/store';

// Function to generate a simple unique identifier.
let idCounter = 0;

// Function to generate a unique numeric identifier.
const generateId = () => ++idCounter;

const initToastsStore = () => {
  const { subscribe, update } = writable<ToastMsg[]>([]);

  return {
    subscribe,

    error({ text, detail }: { text: string; detail?: unknown }) {
      console.error(text, detail);
      update((messages: ToastMsg[]) => [
        ...messages,
        {
          id: generateId(), // Assign a unique ID to each new toast
          text,
          level: 'error',
          detail: errorDetailToString(detail),
          duration: 3000
        },
      ]);
    },

    show(msg: ToastMsg) {
      update((messages: ToastMsg[]) => [
        ...messages,
        { ...msg, id: generateId() } // Ensure every toast has a unique ID
      ]);
    },

    success({ text }: { text: string }) {
      this.show({
        text,
        level: 'success',
        duration: 3000,
        id: generateId() // Ensure every toast has a unique ID
      });
    },

    // Update the hide function to accept a numeric ID
    hide(id: number) {
      update((messages: ToastMsg[]) => messages.filter(message => message.id !== id));
    },
  };
};

export const toasts = initToastsStore();
