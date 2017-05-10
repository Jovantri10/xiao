const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const request = require('superagent');

module.exports = class GreyscaleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'greyscale',
            aliases: ['grayscale'],
            group: 'avataredit',
            memberName: 'greyscale',
            description: 'Greyscale a user\'s avatar colors.',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to edit the avatar of?',
                    type: 'user'
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { user } = args;
        const avatarURL = user.avatarURL('png', 2048);
        if (!avatarURL) return msg.say('This user has no avatar.');
        try {
            const Image = Canvas.Image;
            const canvas = new Canvas(500, 500);
            const ctx = canvas.getContext('2d');
            const avatar = new Image();
            const generate = () => {
                ctx.drawImage(avatar, 0, 0, 500, 500);
                const imgData = ctx.getImageData(0, 0, 500, 500);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                    data[i] = brightness;
                    data[i + 1] = brightness;
                    data[i + 2] = brightness;
                }
                ctx.putImageData(imgData, 0, 0);
            };
            const avatarImg = await request
                .get(avatarURL);
            avatar.src = avatarImg.body;
            generate();
            return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'greyscale.png' }] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say('An Error Occurred while creating the image.');
        }
    }
};
