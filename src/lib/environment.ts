import { $ } from 'bun';

export default class Environment {
  static PORT = process.env['PORT']! || 3000;
  static VERSION = async () => {
    // Get and cache version
    if (!_VERSION) {
      try {
        const packageJsonFile = Bun.file('package.json');
        const packageJson = await packageJsonFile.json();
        const version = packageJson.version + '-' + (await Environment.GIT_TAG());

        // Cache version
        _VERSION = version;
      } catch (e) {
        console.error(e);
        _VERSION = '1.0.0-error';
      }
    }

    return _VERSION;
  };

  private static GIT_TAG = async () => (await $`git rev-parse --short HEAD`.quiet()).text().trim();
}

// Cache
let _VERSION: string | undefined = undefined;
