import type { TypedPocketBase } from '$lib/pocketbase-types';

import { writable } from 'svelte/store';
import PocketBase, { type AuthModel } from 'pocketbase';

export function createInstance() {
    return new PocketBase('https://db.voix.izmichael.com') as TypedPocketBase;
}

export const pb = createInstance();

export const currentUser = writable<AuthModel>();

export function isEmail(str: string) {
    const regex =
        // eslint-disable-next-line no-control-regex
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(str);
}

export async function getGravatarHash(email: string) {
    const address = String(email).trim().toLowerCase();
    const hash = await sha256(address);
    return hash;
}

export function getGravatarUrl(hash: string) {
    return `https://www.gravatar.com/avatar/${hash}?s=250&d=retro&r=pg`;
}

async function sha256(str: string) {
    const buffer = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return hex(hash);
}

function hex(buffer: ArrayBuffer) {
    let digest = '';
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        digest += paddedValue;
    }

    return digest;
}

export type Question = {
    id: string;
    label: string;
    required: boolean;
    type: 'short-text' | 'long-text' | 'number' | 'boolean' | 'rating' | 'radio' | 'checkboxes';
    options: {
        [id: string]: string;
    };
};
