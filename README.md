## AY Machine

A Discord bot that converts chiptune formats into mp3 upon attaching it on server conversation.
It incorporates multiple command-line players for a wide support of common chiptune formats.
The bot is also modular as well, meaning the code can be changed to support other players as well.

### Tools used

- zxtune: https://zxtune.bitbucket.io/
- furnace: https://github.com/tildearrow/furnace
- chipnsfx: http://cngsoft.no-ip.org/chipnsfx.htm
- arkos tracker: https://www.julien-nevo.com/arkostracker/
- psgplay: https://github.com/frno7/psgplay
- ffmpeg: https://ffmpeg.org/

AY machine uses these CLIs in order to render the tracks.
They have to be placed in a separate "tools" folder .

### Setup

- `BOT_TOKEN` must be available in env (supports `.env`).
- `npm install`

### Run

- Dev (TS): `npm run dev`
- Build: `npm run build`
- Start: `npm start`
- Continuous restart: `./run.sh`

### Usage in Discord

- Attach a supported chiptune file; the bot replies with an MP3.
- Control AY options (zxtune-compatible formats) by writing flags anywhere in the message, no prefix:
  - `clock=<chip_preset|hz|mhz>`
  - `layout=<abc|acb|bac|bca|cba|cab|mono>`
  - `type=<ay|ym>`
- Examples:
  - `clock=zx layout=abc`
  - `clock=1.75 type=ym`
  - `clock=1750000`
- Skip a specific attachment: include the word `ignore` anywhere in the message (legacy also supported: `$aymignorefile`).
- Help: slash command `/help` shows current presets and usage. When running bot on a server, global command update may take time to propagate.
