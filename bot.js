require("dotenv").config();

const { Client, Intents, Message } = require("discord.js");

const PREFIX = "$";
const CHANGE_ROLE = "change-role";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ["MESSAGE"],
});

client.on("ready", () => {
  console.log(`${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .substring(PREFIX.length)
      .split(/\s+/);
    if (CMD_NAME === "kick") {
      if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("you do not have permissions to use that command");
      if (args.length === 0) return message.channel.send("provide an id");
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => {
            message.channel.send(`${member} is kiked`);
          })
          .catch((err) => message.channel.send("I cannot kick that user"));
      } else {
        message.channel.send("the member was not found");
      }
    }
    if (CMD_NAME === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("you do not have permissions to use that command");
      if (args.length === 0) return message.channel.send("provide an id");

      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send("user was banned successfully");
      } catch (err) {
        message.channel.send("some error occured");
      }
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "hello") {
    message.channel.send("hi");
  }
  if (message.content === `${PREFIX}${CHANGE_ROLE}`) {
    message.member.roles.add("948924495547207700");
  }
});

client.on("messageDelete", (msg) => {
  msg.channel.send("stop deleting messages");
});

client.login(process.env.DISCORD_BOT_TOKEN);
