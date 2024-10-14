export interface Data {
    [key: string]: any;
}

export interface Target {
    entity_id?: string;
    device_id?: string;
}

export interface NestedObject {
    data: Data;
    target?: Target;
}

export interface TimePattern {
    [key: string]: NestedObject;
}

export interface SceneStudioSchema {
    [key: string]: TimePattern;
}

export type LoginStore = {
    url: string
    token: string
}
