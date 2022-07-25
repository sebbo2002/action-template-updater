export type CoreInterface = {
    info(message: string): void;
    error(message: string | Error): void;
    warning(message: string | Error): void;
    notice(message: string): void;
    startGroup(message: string): void;
    endGroup(): void;
    setOutput(key: string, value: unknown): void;
}

export type CoreMockMessageString = ['info' | 'notice', string];
export type CoreMockMessageError = ['error' | 'warning', string | Error];
export type CoreMockMessageOutput = ['output', string, unknown];
export type CoreMockMessage = CoreMockMessageString | CoreMockMessageError | CoreMockMessageOutput;
export type CoreMockGroup = ['group', string, CoreMockMessage[]];
export type CoreMockBufferItem = CoreMockMessage | CoreMockGroup;

const buffer: CoreMockBufferItem[] = [];
let group: CoreMockGroup | undefined;

function add(message: CoreMockMessage): void {
    if (group) {
        group[2].push(message);
    } else {
        buffer.push(message);
    }
}

export function resetBuffer(): void {
    buffer.length = 0;
}

export function getBuffer(): CoreMockBufferItem[] {
    return buffer;
}

export const core: CoreInterface = {
    info(message: string) {
        add(['info', message]);
    },

    error(message: string | Error) {
        add(['error', message]);
    },

    warning(message: string | Error) {
        add(['warning', message]);
    },

    notice(message: string) {
        add(['notice', message]);
    },

    startGroup (message: string) {
        group = ['group', message, []];
        buffer.push(group);
    },

    endGroup () {
        if (group) {
            group = undefined;
        }
    },

    setOutput (key: string, value: unknown): void {
        const m: CoreMockMessageOutput = ['output', key, value];
        buffer.push(m);
    }
};
