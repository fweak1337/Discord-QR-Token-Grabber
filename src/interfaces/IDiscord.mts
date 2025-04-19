export interface IUser {
  id?: string;
  username?: string;
  avatar?: string;
  discriminator?: string;
  public_flags?: number;
  flags?: number;
  banner?: string;
  accent_color?: number;
  global_name?: string;
  banner_color?: string;
  mfa_enabled?: boolean;
  locale?: string;
  premium_type?: number;
  email?: string;
  verified?: boolean;
  phone?: string;
  nsfw_allowed?: boolean;
  linked_users?: any[];
  purchased_flags?: number;
  bio?: string;
  authenticator_types?: any[];
}

export interface IFriend {
  id: string;
  type: number;
  nickname: string | null;
  user: {
    id: string;
    username: string;
    global_name: string;
    avatar: string;
    avatar_decoration_data: string | null;
    discriminator: string;
    public_flags: 0;
  };
}

export interface IChannel {
  id: string;
  type: number;
  last_message_id: string;
  recipients: IFriend[];
}

export interface IBoost {
  id: string;
  subscription_id: string;
  premium_guild_subscription: {
    id: string;
    user_id: string;
    guild_id: string;
    ended: boolean;
  };
  canceled: boolean;
  cooldown_ends_at: string;
}
