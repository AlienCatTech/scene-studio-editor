import { get } from 'svelte/store';
import type { LoginStore } from './types';
import { loginStore } from './store';

const callHA = async (path: string) => {
    const login = get(loginStore)
    if (login) {
        return await fetch(login.url + path, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${login.token}`,
                "Content-Type": "application/json"
            }
        })
    }
    return Promise.reject("No url or token setup")

}

export const testConnection = async (login: LoginStore) => {
    try {
        const r = await fetch(login.url + "/api/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${login.token}`,
                "Content-Type": "application/json"
            }
        })
        if (r.status != 200) {
            return await r.text();

        }
    } catch (e) {
        return e
    }
}
