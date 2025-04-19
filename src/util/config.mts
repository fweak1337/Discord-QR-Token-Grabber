import 'dotenv/config';
import { IConfig } from '../interfaces/IConfig.mts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH: string = path.resolve(__dirname, '..', 'config.json');

const defaultConfig: IConfig = {
  name: process.env.NAME || '',
  token: process.env.TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  color: process.env.COLOR || '',
  port: process.env.PORT || '3000',
  owner_ids: [],
  auto_boost: false,
  roles: {},
  log: {
    guild_id: process.env.GUILD_ID || '',
    channel_id: process.env.CHANNEL_ID || '',
  },
  auto_msg: {
    enabled: false,
    message_text: process.env.MESSAGE_TEXT || '',
    block_after_msg: false,
  },
  capmonster: {
    key: process.env.CAPMONSTER_APIKEY || '',
  },
};

let config: IConfig;

try {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
} catch (error) {
  config = defaultConfig;
}

export const saveRoleConfig = (roles: { [key: string]: string }): void => {
  config.roles = roles;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
};

export { config };
