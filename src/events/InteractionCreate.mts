import { Interaction, InteractionType, ButtonInteraction } from 'discord.js';
import { sharedClient } from '../index.mts';

export default {
  name: 'interactionCreate',
  callback: async (interaction: Interaction) => {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        sharedClient.commands.get(interaction.commandName)?.callback(interaction);

      case InteractionType.MessageComponent:
        sharedClient.buttons.get((interaction as ButtonInteraction).customId)?.callback(interaction);
      default:
        break;
    }
  },
};
