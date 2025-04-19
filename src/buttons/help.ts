import { ButtonInteraction } from 'discord.js';

export default {
  id: 'help',
  async callback(interaction: ButtonInteraction) {
    await interaction.reply({
      ephemeral: true,
      content: 'https://wickbot.com/support',
    });
  },
};
