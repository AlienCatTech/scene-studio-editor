import { get } from 'svelte/store';
import type { LoginStore } from './types';
import { loginStore } from './store';

const callHA = async (path: string) => {
	const login = get(loginStore);
	if (login) {
		const r = await fetch(login.url + path, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${login.token}`,
				'Content-Type': 'application/json'
			}
		});
		return await r.json();
	}
	return Promise.reject('No url or token setup');
};

export const listServices = () => {
	return callHA('/api/services');
};

export const listEntities = () => {
	return callHA('/api/states');
};

export const getMedia = (media: string) => {
	return callHA('/media/media/' + media);
};

export const uploadMedia = async (file: File) => {
	const login = get(loginStore);
	if (login) {
		const formData = new FormData();
		formData.append('media_content_id', 'media-source://media_source/media/.');
		formData.append('file', file);

		const r = await fetch(login.url + '/api/media_source/local_source/upload', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${login.token}`
			},
			body: formData
		});
		return await r.json();
	}
	return Promise.reject('No url or token setup');
};

export const testConnection = async (login: LoginStore) => {
	try {
		const r = await fetch(login.url + '/api/', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${login.token}`,
				'Content-Type': 'application/json'
			}
		});
		if (r.status != 200) {
			return await r.text();
		}
	} catch (e) {
		return e;
	}
};
