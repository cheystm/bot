const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "afk",
    usage: "afk <Sebep>",
    category: "genel",
    aliases: ["afık", "afeka"],
    execute: async (client, message, args, kanvekin_embed) => {
        if (message.member.displayName.startsWith("[AFK]") || db.has(`afk-${message.author.id}`)) return client.false(message);
        let reason = args.slice(0).join(' ') || "Sebep Belirtilmedi";
        db.set(`afk-${message.author.id}`, { reason: reason, time: Date.now(), nick: message.member.displayName })
        message.member.setNickname(`[AFK] ` + message.member.displayName).catch(err => { })
        return message.channel.send({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setDescription(`**${message.member} "${["www", ".com", "discord.gg", ".gg", "discord"].some(kanvekin => reason.includes(kanvekin)) ? `(Reklam)` : reason}"** Sebebiyle Afk oldun!`)]
        }).sil(5);
    }
}

client.on(Events.MessageCreate, async (message) => {
    if (message.content.startsWith(".afk")) return;
    if (message.mentions.users.first()) {
        let data = db.get(`afk-${message.mentions.users.first().id}`)
        if (!data) return;
        return message.channel.send({
            embeds: [new EmbedBuilder()
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setDescription(`**${message.mentions.users.first()} "${["www", ".com", "discord.gg", ".gg", "discord"].some(kanvekin => data.reason.includes(kanvekin)) ? `(Reklam)` : data.reason}**" sebebiyle <t:${Math.floor(data.time / 1000)}:R> afk moduna geçiş yaptı!`)
                .setColor("Random")]
        }).sil(5);
    } else
        if (db.has(`afk-${message.author.id}`)) {
            let data = db.get(`afk-${message.author.id}`)
            message.member.setNickname(data.nick).catch(err => { })
            db.delete(`afk-${message.author.id}`)
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setDescription(`Hey ${message.member}, artık afk değilsin.`).setColor("Random")]
            }).sil(5);
        }
})