import { writable } from 'svelte/store';
import type {    SceneStudioSchema,LoginStore } from './types';

export const preset = writable<SceneStudioSchema>({});
export const loginStore = writable<LoginStore | undefined>()
