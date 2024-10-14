import { TextBox } from '@flexilte/skeleton';
import type { LoginStore, SceneStudioSchema } from './types';
import { loginStore } from './store';

export const components = {
	TextBox
};
export const sortPreset = (p: SceneStudioSchema): SceneStudioSchema => {
	const sortedKeys = Object.keys(p).sort();
	const sortedObj: SceneStudioSchema = {} as SceneStudioSchema;

	sortedKeys.forEach((key) => {
		sortedObj[key] = p[key];
	});

	return sortedObj;
};

export function parseTimeString(timeString: string): [number, number, number] {
	const [hours, minutes, seconds] = timeString.split(':').map(Number);

	if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
		throw new Error('Invalid time string format');
	}

	return [hours, minutes, seconds];
}

export const validTime = (hour: number, min: number, sec: number) => {
	if (
		hour == null ||
		min == null ||
		sec == null ||
		isNaN(hour) ||
		isNaN(min) ||
		isNaN(sec) ||
		hour < 0 ||
		hour > 23 ||
		min < 0 ||
		min > 59 ||
		sec < 0 ||
		sec > 59
	) {
		return false;
	}
	return true;
};

export const numToString = (hour: number, min: number, sec: number) => {
	const formattedHour = hour.toString().padStart(2, '0');
	const formattedMin = min.toString().padStart(2, '0');
	const formattedSec = sec.toString().padStart(2, '0');
	return `${formattedHour}:${formattedMin}:${formattedSec}`;
};

export const addToDict = (key: string, p: Record<string, any>) => {
	if (key in p) {
		return p;
	}
	return {
		...p,
		...{
			[key]: {}
		}
	};
};

export const changeItemInDict = (
	oldKey: string,
	newKey: string,
	p: Record<string, any>
): Record<string, any> => {
	if (oldKey in p) {
		const { [oldKey]: _, ...rest } = p;
		return { ...rest, [newKey]: p[oldKey] };
	}
	return p;
};

export const removeItemFromDict = (time: string, p: Record<string, any>) => {
	if (time in p) {
		const removeKey = <T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
			const { [key]: _, ...rest } = obj;
			return rest;
		};

		return removeKey(p, time);
	}
	return p;
};

export const setLogin = (login: LoginStore) => {
	localStorage.setItem('login', JSON.stringify(login));
	loginStore.set(login);
};
