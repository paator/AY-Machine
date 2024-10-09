# AY Machine

A Discord bot that converts chiptune formats into mp3 upon attaching it on server conversation.
It incorporates multiple command-line players for a wide support of common chiptune formats.
The bot is also modular as well, meaning the code can be changed to support other players as well.

# Tools used:
- zxtune: https://zxtune.bitbucket.io/
- furnace: https://github.com/tildearrow/furnace
- chipnsfx: http://cngsoft.no-ip.org/chipnsfx.htm
- arkos tracker: https://www.julien-nevo.com/arkostracker/
- psgplay: https://github.com/frno7/psgplay
- ffmpeg: https://ffmpeg.org/

AY machine uses these CLIs in order to render the tracks.
They have to be placed in a separate "tools" folder.

# Build
`npm install`, then `node index.js`
