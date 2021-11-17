import * as dotenv from "dotenv";
dotenv.config();

const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg: any) => {
  console.log('msg rcv');
  if (msg.author.bot) return;
  msg.channel.send('hi');
});

console.log('tokeeen', process.env.TOKEN);

client.login(process.env.TOKEN);
