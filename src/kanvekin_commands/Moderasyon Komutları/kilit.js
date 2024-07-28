const { PermissionFlagsBits, PermissionsBitField, Events, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
  name: "kilit",
  usage: "kilit",
  category: "moderasyon",
  aliases: ["kanal-kilit", "kanalkilit", "kilitle", "kilitaç", "kilitkapat"],
  execute: async (client, message, args, kanvekin_embed) => {
    let staffData = await db.get("kanvekin-ban-staff") || [];
    if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
    if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({
      embeds: [kanvekin_embed
        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
        .setTimestamp()
        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
        .setColor("Random")
        .setTitle('Bir hata oluştu')
        .setDescription(`Hey, bu komutu kullanabilmek için gerekli izinlere sahip değilsin!`)]
    }).sil(5);

    let button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`lockackapa-${message.member.id}`)
        .setStyle(!message.channel.permissionsFor(message.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? ButtonStyle.Danger : ButtonStyle.Success)
        .setEmoji(!message.channel.permissionsFor(message.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? "🔒" : "🔓")
        .setLabel(!message.channel.permissionsFor(message.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone")).has(PermissionFlagsBits.SendMessages) ? "Kilitle" : "Kilit Aç")
    )

    client.true(message)
    if (message.channel.permissionsFor(message.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone")).has(PermissionFlagsBits.SendMessages)) {
      await message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone").id, { SendMessages: false });
      return message.reply({
        components: [button], embeds: [new EmbedBuilder()
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`\`🔒\` Kanal ${message.author} tarafından kilitlendi!`)]
      });
    } else {
      await message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone").id, { SendMessages: true });
      return message.reply({
        components: [button], embeds: [new EmbedBuilder()
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`\`🔓\` Kanalın kilidi ${message.author} tarafından açıldı!`)]
      });
    };
  }
}

client.on(Events.InteractionCreate, async (kanvekin) => {
  if (!kanvekin.isButton()) return;
  if (kanvekin.customId == `lockackapa-${kanvekin.member.id}`) {
    kanvekin.message.delete().catch(err => { });
    if (kanvekin.channel.permissionsFor(kanvekin.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone")).has(PermissionFlagsBits.SendMessages)) {
      await kanvekin.channel.permissionOverwrites.edit(kanvekin.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone").id, { SendMessages: false });
      return kanvekin.channel.send({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`\`🔒\` Kanal ${kanvekin.member} tarafından kilitlendi!`)]
      });
    } else {
      await kanvekin.channel.permissionOverwrites.edit(kanvekin.guild.roles.cache.find(kanvekin => kanvekin.name == "@everyone").id, { SendMessages: true });
      return kanvekin.channel.send({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`\`🔓\` Kanalın kilidi ${kanvekin.member} tarafından açıldı!`)]
      });
    };
  }
})