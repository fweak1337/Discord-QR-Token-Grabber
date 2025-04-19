export interface IHello {
  op: string;
  timeout_ms: number;
  heartbeat_interval: number;
}

export interface INonceProof {
  op: string;
  encrypted_nonce: string;
}

export interface IPrendingRemoteInit {
  op: string;
  fingerprint: string;
}

export interface IPendingTicket {
  op: string;
  encrypted_user_payload: string;
}

export interface IPendingLogin {
  op: string;
  ticket: string;
}

export interface ICaptcha {
  captcha_key: string[];
  captcha_sitekey: string;
  captcha_service: string;
  captcha_rqdata: string;
  captcha_rqtoken: string;
}
