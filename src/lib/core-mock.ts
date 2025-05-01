export type CoreInterface = {
    endGroup(): void;
    error(message: Error | string): void;
    info(message: string): void;
    notice(message: string): void;
    setOutput(key: string, value: unknown): void;
    startGroup(message: string): void;
    warning(message: Error | string): void;
};

export type CoreMockBufferItem = CoreMockGroup | CoreMockMessage;
export type CoreMockGroup = ['group', string, CoreMockMessage[]];
export type CoreMockMessage =
    | CoreMockMessageError
    | CoreMockMessageOutput
    | CoreMockMessageString;
export type CoreMockMessageError = ['error' | 'warning', Error | string];
export type CoreMockMessageOutput = ['output', string, unknown];
export type CoreMockMessageString = ['info' | 'notice', string];

const buffer: CoreMockBufferItem[] = [];
let group: CoreMockGroup | undefined;

export function getBuffer(): CoreMockBufferItem[] {
    return buffer;
}

export function resetBuffer(): void {
    buffer.length = 0;
}

function add(message: CoreMockMessage): void {
    if (group) {
        group[2].push(message);
    } else {
        buffer.push(message);
    }
}

export const core: CoreInterface = {
    endGroup() {
        if (group) {
            group = undefined;
        }
    },

    error(message: Error | string) {
        add(['error', message]);
    },

    info(message: string) {
        add(['info', message]);
    },

    notice(message: string) {
        add(['notice', message]);
    },

    setOutput(key: string, value: unknown): void {
        const m: CoreMockMessageOutput = ['output', key, value];
        buffer.push(m);
    },

    startGroup(message: string) {
        group = ['group', message, []];
        buffer.push(group);
    },

    warning(message: Error | string) {
        add(['warning', message]);
    },
};
