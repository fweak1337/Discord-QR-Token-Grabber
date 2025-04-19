import { MessageEvent } from 'ws';
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export interface ICommand {
  name: string;
  data: SlashCommandBuilder;
  callback: (interaction: CommandInteraction) => void;
}

export interface IButton {
  id: string;
  callback: (...args: any[]) => void;
}

export interface IEvent {
  name: string;
  callback: (...args: any[]) => void;
}

export interface IMessage {
  name: string;
  callback: (message: MessageEvent) => void;
}
