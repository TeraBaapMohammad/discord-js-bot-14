const { GuildMember, PartialGuildMember } = require("discord.js");
const { BotClient } = require("@src/structures");
const { getSettings, updateBotCount } = require("@schemas/counter-schema");
const { inviteHandler, greetingHandler } = require("@src/handlers");

/**
 * @param {BotClient} client
 * @param {GuildMember|PartialGuildMember} member
 */
module.exports = async (client, member) => {
  if (member.partial) await member.fetch();
  if (!member || !member.guild) return;
  const { guild } = member;

  const counterConfig = await getSettings(guild.id);
  if (counterConfig) {
    if (member.user.bot) await updateBotCount(guild.id, -1, true);
    if (!client.counterUpdateQueue.includes(guild.id)) client.counterUpdateQueue.push(guild.id);
  }

  // Invite Tracker
  const inviterData = await inviteHandler.trackLeftMember(member);

  // Farewell message
  greetingHandler.sendFarewell(member, inviterData);
};
