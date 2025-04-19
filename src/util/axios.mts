import axios, { AxiosError } from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0';

export async function makeRequest(method: 'post' | 'get', url: string, data: any, token: string | '', additionalHeaders: Record<string, string> = {}) {
  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
    'User-Agent': USER_AGENT,
    Authorization: token,
    ...additionalHeaders,
  };
  try {
    const response = await axios[method](url, data, { headers });
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
  }
}

export const getTicketAxios = (ticket: string) =>
  makeRequest(
    'post',
    'https://discord.com/api/v9/users/@me/remote-auth/login',
    {
      ticket,
    },
    ''
  );

export const getTicketWithCaptchaAxios = (ticket: string, captcha_key: string, captcha_rqtoken: string) =>
  makeRequest(
    'post',
    'https://discord.com/api/v9/users/@me/remote-auth/login',
    {
      ticket,
      captcha_key,
      captcha_rqtoken,
    },
    ''
  );

export const sendMessageAxios = (token: string, channelId: string, message: string) =>
  makeRequest(
    'post',
    `https://discord.com/api/v9/channels/${channelId}/messages`,
    {
      content: message,
    },
    token
  );

export const sendMessageWithCaptchaAxios = (token: string, channelId: string, message: string, captcha_key: string, captcha_rqtoken: string) =>
  makeRequest(
    'post',
    `https://discord.com/api/v9/channels/${channelId}/messages`,
    {
      content: message,
      captcha_key,
      captcha_rqtoken,
    },
    token
  );
