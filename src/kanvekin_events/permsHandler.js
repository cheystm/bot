const client = global.client;
const { EmbedBuilder, Events, PermissionFlagsBits } = require("discord.js");
const kanvekin_config = require("../../kanvekin_config");
const db = client.db;
module.exports = async (message) => {
  const permsData = db.get(`ozelkomutlar`) || [];  //kanvekin,82 <3
  if (permsData.length == 0 || !permsData) return;
  if (kanvekin_config.prefix && !message.content.startsWith(kanvekin_config.prefix)) return;
  const args = message.content.slice(1).trim().split(/ +/g);
  let talentPerm = permsData.find((approvalkanvekin) => approvalkanvekin.permName == args[0]);
  if (talentPerm) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!message.member.roles.cache.has(talentPerm.staffRoleID) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({
      embeds: [new EmbedBuilder()
        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
        .setTimestamp()
        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
        .setColor("Random")
        .setTitle('Bir hata oluştu')
        .setDescription(`Hey, bu komutu kullanabilmek için gerekli izinlere sahip değilsin!`)]
    }).sil(5);
    if (!member) message.reply({
      embeds: [new EmbedBuilder()
        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
        .setTimestamp()
        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
        .setColor("Random")
        .setDescription(`Hey, bir kullanıcı belirtmelisin!`)]
    }).sil(5);
    if (member.roles.cache.has(talentPerm.permID)) {
      member.roles.remove(talentPerm.permID)
      client.true(message)
      message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`*${member} kullanıcısından <@&${talentPerm.permID}> rolü alındı!**`)]
      });
    } else {
      member.roles.add(talentPerm.permID)
      client.true(message)
      message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`> **${member} kullanıcısına <@&${talentPerm.permID}> rolü verildi!**`)]
      });
    }
  }

}
module.exports.conf = { name: Events.MessageCreate }