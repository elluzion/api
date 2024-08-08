import { $ } from 'bun';

export default class Environment {
  static IS_DEV = process.env.NODE_ENV !== 'production';
  static PORT = process.env['PORT']! || 3000;
  static VERSION = async () => {
    // Get and cache version
    if (!_VERSION) {
      try {
        const packageJsonFile = Bun.file('package.json');
        const packageJson = await packageJsonFile.json();
        const tag = await Environment.GIT_TAG();
        const version = packageJson.version + (tag ? `-${tag}` : '');

        // Cache version
        _VERSION = version;
      } catch (e) {
        console.error(e);
        _VERSION = '1.0.0-error';
      }
    }

    return _VERSION;
  };

  private static GIT_TAG = async () => {
    try {
      return (await $`git rev-parse --short HEAD`.quiet()).text().trim();
    } catch (e) {
      return undefined;
    }
  };
}

// Cache
let _VERSION: string | undefined = undefined;
