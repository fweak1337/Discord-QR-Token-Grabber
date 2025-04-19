export interface IConfig {
  name: string;
  token: string;
  clientId: string;
  color: string;
  port: string;
  owner_ids: string[];
  auto_boost: boolean;
  roles: {
    [key: string]: string;
  };
  log: {
    guild_id: string;
    channel_id: string;
  };
  auto_msg: {
    enabled: boolean;
    message_text: string;
    block_after_msg: boolean;
  };
  capmonster: {
    key: string;
  };
}
