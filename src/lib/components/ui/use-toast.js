import { writable } from 'svelte/store';

let toastId = 0;

const createStore = () => {
  const { subscribe, update } = writable([]);

  const dismiss = (id) => {
    update((items) => items.filter((toast) => toast.id !== id));
  };

  const push = (toast) => {
    const id = ++toastId;
    const duration = toast.duration ?? 3500;

    update((items) => [
      ...items,
      {
        id,
        title: toast.title ?? '',
        description: toast.description ?? '',
        variant: toast.variant ?? 'default',
        duration
      }
    ]);

    if (Number.isFinite(duration) && duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    return id;
  };

  return {
    subscribe,
    push,
    dismiss
  };
};

export const toasts = createStore();

export const toast = (options) => toasts.push(options ?? {});
export const dismissToast = (id) => toasts.dismiss(id);
