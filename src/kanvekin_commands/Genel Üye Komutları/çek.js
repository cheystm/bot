const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "çek",
    usage: "çek [@kerem / ID]",
    category: "genel",
    aliases: ["pull", "çek", "yanıma-çek"],
    execute: async (client, message, args, kanvekin_embed) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!message.member.voice.channel) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setTitle('Bir hata oluştu')
                .setColor("Random")
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setDescription(`Hey, öncelikle herhangi bir ses kanalında bulunmanız gerekiyor!`)]
        }).sil(5);
        if (!member || !member.voice.channel || member.id === message.author.id) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setTitle('Bir hata oluştu')
                .setColor("Random")
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setDescription(`Hey, seste olan bir kullanıcıyı etiketlemeniz gerekiyor!`)]
        }).sil(5);
        if (member.voice.channel.id == message.member.voice.channel.id) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setTitle('Bir hata oluştu')
                .setColor("Random")
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setDescription(`Hey, zaten aynı kanaldasınız!`)]
        }).sil(5);

        const kanvekin_dropdown = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('tasıma')
                    .setPlaceholder(`Onayla / Reddet`)
                    .addOptions([
                        { label: `Onayla`, description: `Taşıma İşlemini Onayla`, value: `onay`, emoji: `${client.emoji("emote_true") !== null ? client.emoji("emote_true") : "1264712219250130975"}` },
                        { label: `Reddet`, description: `Taşıma İşlemini Reddet`, value: `red`, emoji: `${client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌"}` }]))
        let mesajkanvekin;
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (message.member.voice.channel && member.voice.channel) member.voice.setChannel(message.member.voice.channel);
            message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setDescription(`Hey, belirttiğiniz kullanıcı başarıyla ses kanalına çekilmiştir!`)
                    .setColor("Random")]
            }).sil(5);
            client.true(message)
        } else {
            mesajkanvekin = message.reply({ content: `> **${member}, ${message.author} \`${member.voice.channel.name}\` adlı kanala sizi çekmek istiyor**`, components: [kanvekin_dropdown] })

            mesajkanvekin.then(b2 => {
                const filter = i => i.user.id === member.id;
                const collector = b2.createMessageComponentCollector({ filter: filter, time: 30000, max: 1 });
                collector.on('end', async (kanvekin) => {
                    if (kanvekin.size !== 0) return;
                    kanvekin_dropdown.components[0].setDisabled(true);
                    b2.edit({ content: `> **İşlem süresi doldu!**`, components: [kanvekin_dropdown] })
                    client.false(message);
                })
                collector.on('collect', async b => {
                    if (!b.isStringSelectMenu()) return;
                    const value = b.values[0]
                    if (value === "onay") {
                        client.true(message)
                        message.reply({
                            embeds: [kanvekin_embed
                                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                                .setTimestamp()
                                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                                .setDescription(`Hey, taşıma işlemi onaylandı`)
                                .setColor("Random")]
                        }).sil(5);
                        if (message.member.voice.channel && member.voice.channel) member.voice.setChannel(message.member.voice.channel);
                    }
                    if (value === "red") {
                        client.false(message)
                        message.reply({
                            embeds: [kanvekin_embed
                                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                                .setTimestamp()
                                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                                .setDescription(`Hey, taşıma işlemi reddedildi.`)
                                .setColor("Random")]
                        }).sil(5);
                    }
                    collector.stop()
                    b.message.delete().catch(e => { })
                })
            })
        }

    }
}
