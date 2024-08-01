
export default class Environment {
  static PORT = process.env['PORT']!;
  static TLS_KEY = process.env['TLS_KEY_PATH'];
  static TLS_CERT = process.env['TLS_CERT_PATH'];

  static validate() {
    if (!this.PORT) {
      this.error('PORT');
    }
  }

  private static error(envVariable: string) {
    throw new Error(`Environment ${envVariable} is not defined in .env`);
  }
}