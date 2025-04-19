import { HCaptchaTask } from 'node-capmonster';
import { config } from '../util/config.mts';

export class CaptchaSolver {
  private static apiKey: string = config.capmonster.key;

  public static async solveCaptcha(captchaSitekey: string, captchaRQdata: string | null) {
    const captchaTask = new HCaptchaTask(this.apiKey);
    captchaTask.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0';
    const captchTaskId = await captchaTask.createTask('https://discord.com/login', captchaSitekey, false, captchaRQdata!);

    const captcha = await captchaTask.joinTaskResult(captchTaskId, 300);
    return captcha.gRecaptchaResponse;
  }
}
