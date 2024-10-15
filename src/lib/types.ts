export interface Target {
	entity_id?: string;
	device_id?: string;
}

export interface ServiceSlot {
	service: string;
	data?: Record<string, unknown>;
	target?: Target;
}

export interface SceneStudioSchema {
	[key: string]: ServiceSlot[];
}

export type LoginStore = {
	url: string;
	token: string;
};
