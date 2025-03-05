function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export { isBrowser };
