export type CoreInterface = {
    info(message: string): void;
    error(message: string | Error): void;
    warning(message: string | Error): void;
    notice(message: string): void;
    startGroup(message: string): void;
    endGroup(): void;
    setOutput(key: string, value: unknown): void;
};
export type CoreMockMessageString = ['info' | 'notice', string];
export type CoreMockMessageError = ['error' | 'warning', string | Error];
export type CoreMockMessageOutput = ['output', string, unknown];
export type CoreMockMessage = CoreMockMessageString | CoreMockMessageError | CoreMockMessageOutput;
export type CoreMockGroup = ['group', string, CoreMockMessage[]];
export type CoreMockBufferItem = CoreMockMessage | CoreMockGroup;
export declare function resetBuffer(): void;
export declare function getBuffer(): CoreMockBufferItem[];
export declare const core: CoreInterface;
