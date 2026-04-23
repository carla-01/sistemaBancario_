export interface ActionDeps {
  setFormMessage: (form: HTMLElement, text: string) => void;
  clearWorkspace: () => void;
  showPopout: (message: string, durationMs?: number) => void;
  getAccountField: (form: HTMLElement, fieldName?: string) => HTMLInputElement | null;
}
