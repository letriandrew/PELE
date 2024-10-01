import dotenv from 'dotenv';

dotenv.config();

class Settings {
  constructor() {
    this.serverUrl = process.env.SERVER_URL;

    if (!this.serverUrl) {
      throw new Error('Server URL not found. Ensure it\'s set in the .env file.');
    } 
  }
}

// Export an instance of the Settings class
const settings = new Settings();
export { settings };

