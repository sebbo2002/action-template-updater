export declare type CoreInterface = {
    info(message: string): void;
    error(message: string | Error): void;
    warning(message: string | Error): void;
    notice(message: string): void;
    startGroup(message: string): void;
    endGroup(): void;
};
export declare type CoreMockMessageString = ['info' | 'notice', string];
export declare type CoreMockMessageError = ['error' | 'warning', string | Error];
export declare type CoreMockMessage = CoreMockMessageString | CoreMockMessageError;
export declare type CoreMockGroup = ['group', string, CoreMockMessage[]];
export declare type CoreMockBufferItem = CoreMockMessage | CoreMockGroup;
export declare function resetBuffer(): void;
export declare function getBuffer(): CoreMockBufferItem[];
export declare const core: CoreInterface;
