import { Client, Collection, REST, Routes, Guild, Emoji, Channel } from 'discord.js';
import { readdirSync } from 'fs';
import { config } from '../util/config.mts';
import { IButton, ICommand, IEvent } from '../interfaces/IApplication.mts';
import { fileURLToPath } from 'url';
import * as path from 'path';
import 'colors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BotClient {
  public events = new Collection<string, IEvent>();
  public emojis = new Collection<string, Emoji>();
  public commands = new Collection<string, ICommand>();
  public buttons = new Collection<string, IButton>();
  public guild: Guild | null = null;
  public channel: Channel | null = null;

  constructor(public readonly client: Client) {
    console.log(config);
    this.client.login(config.token);

    this.registerEvents();
    this.registerCommands();
    this.registerButtons();
    this.registerAntiCrash();
  }

  private async registerEvents() {
    const eventFiles = readdirSync(path.join(__dirname, '..', 'events'));

    for (const file of eventFiles) {
      const event = await import(`../events/${file}`);
      this.events.set(event.default.name, event.default);
    }

    this.events.forEach((event) => {
      this.client.on(event.name, event.callback);
    });
  }

  private async registerCommands() {
    const commandFiles = readdirSync(path.join(__dirname, '..', 'commands'));

    for (const file of commandFiles) {
      const command = await import(`../commands/${file}`);
      this.commands.set(command.default.name, command.default);
    }

    const rest = new REST({ version: '10' }).setToken(config.token);

    await rest.put(Routes.applicationCommands(config.clientId), {
      body: this.commands.map((command) => command.data.toJSON()),
    });
  }

  private async registerButtons() {
    const buttonFiles = readdirSync(path.join(__dirname, '..', 'buttons'));

    for (const file of buttonFiles) {
      const button = await import(`../buttons/${file}`);
      this.buttons.set(button.default.id, button.default);
    }
  }

  private async registerAntiCrash() {
    process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
      console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow.dim);
      console.log('Reason: ', reason.stack ? String(reason.stack).gray : String(reason).gray);
      console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    });
    process.on('uncaughtException', (err: Error, origin: string) => {
      console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow.dim);
      console.log('Exception: ', err.stack ? String(err.stack) : String(err).gray);
      console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    });
    process.on('uncaughtExceptionMonitor', (err: Error, origin: string) => {
      console.log('\n\n\n\n\n=== uncaught Exception Monitor ==='.toUpperCase().yellow.dim);
      console.log('Exception: ', err.stack ? String(err.stack) : String(err).gray);
      console.log('=== uncaught Exception Monitor ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    });
    process.on('warning', (err: Error) => {
      console.log('\n\n\n\n\n=== uncaught Warning ==='.toUpperCase().yellow.dim);
      console.log('Exception: ', err.stack ? String(err.stack) : String(err).gray);
      console.log('=== uncaught Warning ===\n\n\n\n\n'.toUpperCase().yellow.dim);
    });
  }
}
