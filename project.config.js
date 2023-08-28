import { ProjectConfig } from '@run-z/project-config';

export default new ProjectConfig({
  tools: {
    package: {
      exports: {
        '.': {
          source: './src/main.ts',
          default: './dist/main.js',
        },
      },
    },
  },
});
