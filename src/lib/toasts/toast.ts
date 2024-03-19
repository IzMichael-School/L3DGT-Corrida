import { writable } from 'svelte/store';

export const toasts = writable<Toast[]>([]);
export type Toast = {
    id: string;
    type: 'success' | 'danger' | 'warning' | 'info' | 'default';
    dismissible: boolean;
    timeout: number;
    message: string;
    body?: string;
};

export const add = (message: string, options: Partial<Toast> = {}) => {
    const id = Math.floor(Math.random() * 10000).toString();

    const defaults: Toast = {
        id,
        type: 'default',
        dismissible: true,
        timeout: 5000,
        message,
    };

    toasts.update((all) => [{ ...defaults, ...options } as Toast, ...all]);

    setTimeout(() => dismiss(id), options.timeout || defaults.timeout);

    return id;
};

export const dismiss = (id: string) => {
    toasts.update((all) => all.filter((t) => t.id != id));
};

export const update = (id: string, options: Partial<Toast>) => {
    toasts.update((all) => {
        let toast: Toast | undefined = all.find((t) => t.id == id);
        if (!toast) return all;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toast = { ...toast, ...options };
        console.log('changed');
        return all;
    });
};

export default add;
