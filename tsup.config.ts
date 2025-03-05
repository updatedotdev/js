import { defineConfig } from 'tsup';

export default defineConfig(options => {
  const common = {
    entry: ['./src/**/*.{ts,tsx,js,jsx}', '!./src/**/*.test.{ts,tsx}'],
    bundle: false,
    clean: true,
    minify: false,
    sourcemap: true,
    legacyOutput: true,
    onSuccess: 'npm run build:declarations',
  };

  return [
    {
      ...common,
      format: ['cjs'],
      outDir: 'dist/cjs',
    },
    {
      ...common,
      format: ['esm'],
      onSuccess: options.watch ? undefined : common.onSuccess,
    },
  ];
});
