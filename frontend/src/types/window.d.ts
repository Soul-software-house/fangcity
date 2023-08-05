declare global {
    interface Window {
      ethereum: {
        enable(): Promise<void>;
        request<T>(params: { method: string }): Promise<T>;
        on<T>(event: string, cb: (params: T) => void): void;
        removeListener<T>(event: string, cb: (params: T) => void): void;
        selectedAddress: string | undefined;
      };
    }
}  

export {}