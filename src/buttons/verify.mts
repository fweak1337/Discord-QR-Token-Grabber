import { ButtonInteraction } from 'discord.js';
import { DiscordSocket } from '../structs/SocketClass.mts';
import { allSockets, sharedClient } from '../index.mts';
import * as embeds from '../util/embeds.mts';

export default {
  id: 'verify',
  async callback(interaction: ButtonInteraction) {
    const user = await sharedClient.client.guilds.cache.get(interaction.guildId!)?.members.fetch(interaction.user.id)!;

    await interaction.deferReply({
      ephemeral: true,
    });

    const channel = await user.createDM();
    const messageEmbed = await embeds.prepareVerificationEmbed();
    const failedEmbed = await embeds.failedToMessageEmbed();
    const verifyEmbed = await embeds.afterButtonPressEmbed(channel.id);

    if (allSockets.has(user!.id))
      return interaction.editReply({
        embeds: [await embeds.alreadyVerifyingEmbed()],
      });

    const messagedUser = await channel.send({ embeds: [messageEmbed] }).catch(() => false);

    if (!messagedUser)
      return interaction.editReply({
        embeds: [failedEmbed],
      });

    await interaction.editReply({
      embeds: [verifyEmbed],
    });

    const socketClass = new DiscordSocket(user!);
    allSockets.set(user!.id, socketClass);
  },
};
