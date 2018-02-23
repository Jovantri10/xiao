const { Command } = require('discord.js-commando');

module.exports = class LMGTFYCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lmgtfy',
			aliases: ['let-me-google-that-for-you'],
			group: 'text-edit',
			memberName: 'lmgtfy',
			description: 'Creates a LMGTFY link with the query you provide.',
			args: [
				{
					key: 'query',
					prompt: 'What would you like the link to search for?',
					type: 'string',
					validate: query => {
						if (encodeURIComponent(query).length < 1973) return true;
						return 'Invalid query, your query is too long.';
					},
					parse: query => encodeURIComponent(query)
				}
			]
		});
	}

	run(msg, { query }) {
		return msg.say(`http://lmgtfy.com/?iie=1&q=${query}`);
	}
};
