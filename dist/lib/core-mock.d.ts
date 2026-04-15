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
export type CoreMockMessage = CoreMockMessageError | CoreMockMessageOutput | CoreMockMessageString;
export type CoreMockMessageError = ['error' | 'warning', Error | string];
export type CoreMockMessageOutput = ['output', string, unknown];
export type CoreMockMessageString = ['info' | 'notice', string];
export declare function getBuffer(): CoreMockBufferItem[];
export declare function resetBuffer(): void;
export declare const core: CoreInterface;
