const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder, ComponentType, codeBlock, Embed } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
const ms = require("ms")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr");
const canvafy = require("canvafy");
const messageGuild = require("../../kanvekin_schemas/messageGuildSchema");
const messageGuildChannel = require("../../kanvekin_schemas/messageGuildChannelsSchema");
const voiceGuild = require("../../kanvekin_schemas/voiceGuildSchema");
const voiceGuildChannel = require("../../kanvekin_schemas/voiceGuildChannelsSchema");
const messageUser = require("../../kanvekin_schemas/messagesSchema");
const voiceUser = require("../../kanvekin_schemas/voicesSchema");
const point = require("../../kanvekin_schemas/staffsSchema");
const invite = require("../../kanvekin_schemas/invitesSchema");
const task = require("../../kanvekin_schemas/tasksSchema");
module.exports = {
    name: "bonus",
    usage: "bonus [+/-] [@kerem / ID] <Adet>",
    category: "stat",
    aliases: ["davetbonus", "bonusekle", "bonuss", "ekstra", "davetekle"],
    execute: async (client, message, args, kanvekin_embed) => {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, bu komutu kullanabilmek için gerekli izinlere sahip değilsin!`)]
        }).sil(5);

        let cmd = args[0];
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let value = Number(args[2]);
        if (cmd == '+') {
            if (!member) return message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle('Bir hata oluştu')
                    .setDescription(`Hey, bir kullanıcı belirtiniz`)]
            })
            if (!value) return message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle('Bir hata oluştu')
                    .setDescription(`Hey, bir değer belirtiniz!`)]
            })

            let data = await invite.findOne({ guildId: message.guild.id, userId: member.id })
            if (!data) {
                await new invite({ guildId: message.guild.id, userId: member.id, Regular: 0, Fake: 0, Left: 0, leftedMembers: [], Bonus: value }).save();
                await message.reply({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setTitle('Bir hata oluştu')
                        .setDescription(`${member} kullanıcısına **${value}** adet bonus davet eklendi!`)]
                })
            } else {
                data.Bonus += value
                await data.save();
                await message.reply({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setTitle('Bir hata oluştu')
                        .setDescription(`${member} kullanıcısına **${value}** adet bonus davet eklendi!`)]
                })

            }
        } else if (cmd == '-') {
            if (!member) return message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle('Bir hata oluştu')
                    .setDescription(`Hey, bir kullanıcı belirtiniz!`)]
            })
            if (!value) return message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle('Bir hata oluştu')
                    .setDescription(`Hey, bir değer belirtmen gerekiyor!`)]
            })
            let data = await invite.findOne({ guildId: message.guild.id, userId: member.id });
            if (!data) return message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle('Bir hata oluştu')
                    .setDescription(`Hey, bu kullanıcının davet verisi bulunmamaktadır!`)]
            })
            data.Bonus -= value;
            await data.save();
            await message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle('Bir hata oluştu')
                    .setDescription(`${member} kullanıcısının **${value}** adet bonus daveti silindi!`)]
            })
        } else {
            message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle('Bir hata oluştu')
                    .setDescription(`**Örnek Kullanım; \`${kanvekin_config.prefix}bonus [+ / -] [@kerem / ID] [5]\`**`)]
            })
        }



    }
}
