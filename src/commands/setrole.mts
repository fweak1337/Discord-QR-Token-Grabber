import { SlashCommandBuilder, PermissionsBitField, ChatInputCommandInteraction } from 'discord.js';
import { config, saveRoleConfig } from '../util/config.mts';
import * as embeds from '../util/embeds.mts';
import { owner_ids } from '../config.json';

export default {
  name: 'setrole',
  data: new SlashCommandBuilder()
    .setName('setrole')
    .setDescription('Set a role for a verified user.')
    .addRoleOption((option) => option.setName('role').setDescription('The role to give to the user.').setRequired(true)),
  async callback(interaction: ChatInputCommandInteraction) {
    function isOwner(ownerId: string | number): boolean {
      if (typeof ownerId === 'number') {
        ownerId = ownerId.toString();
      }
      return owner_ids.includes(ownerId);
    }

    if (!(interaction.member?.permissions as Readonly<PermissionsBitField>).has(PermissionsBitField.Flags.ManageGuild) || !isOwner(interaction.user.id)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [await embeds.lackPermissionsEmebd()],
      });
    }

    const roleOption = interaction.options.get('role');

    if (!roleOption) {
      return interaction.reply({
        ephemeral: true,
        embeds: [await embeds.lackPermissionsEmebd()],
      });
    }

    const role = roleOption.role;

    if (role?.position! >= (await interaction.guild?.members.fetchMe())?.roles.highest?.position!)
      return await interaction.reply({
        ephemeral: true,
        embeds: [await embeds.roleIsAboveMeEmbed()],
      });

    const roles = { ...config.roles };
    roles[interaction.guildId!] = role?.id!;
    saveRoleConfig(roles);

    await interaction.reply({
      ephemeral: true,
      embeds: [await embeds.setRoleEmbed()],
    });
  },
};
