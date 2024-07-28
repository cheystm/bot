const { PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "sicil",
    usage: "sicil [@kerem / ID]",
    category: "moderasyon",
    aliases: ["geçmiş", "cezalar", "cezaları"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
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
        if (!member) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, bir kullanıcı belirtmen gerekiyor!`)]
        }).sil(5);
        let names = db.get(`sicil-${member.id}`);
        if (!names) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, belirttiğiniz kullanıcının sicil kaydı bulunmamaktadır!`)]
        }).sil(5);
        if (names && names.length <= 10) {
            message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle("Kullanıcının Sicil Verileri")
                    .setDescription(names.map((data, n) => `${data}`).join("\n\n"))]
            })
        } else {
            let pages = 1;
            const kanvekin_buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("kanvekin_back")
                        .setLabel("⬅️")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("kanvekin_exit")
                        .setLabel("🗑️")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId("kanvekin_skip")
                        .setLabel("➡️")
                        .setStyle(ButtonStyle.Secondary)
                );
            let mesaj = await message.reply({
                components: [kanvekin_buttons], embeds: [
                    kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setTitle("Kullanıcının Sicil Verileri")
                        .setDescription(`${names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).map((data, n) => `${data}`).join("\n\n")}`)]
            })

            const filter = i => i.user.id === message.member.id;
            const collector = mesaj.createMessageComponentCollector({ filter: filter, time: 120000 });
            collector.on("collect", async (kanvekin) => {
                if (kanvekin.customId == "kanvekin_skip") {
                    if (names.slice((pages + 1) * 10 - 10, (pages + 1) * 10).length <= 0) return kanvekin.reply({ ephemeral: true, content: `> **❌ Daha Fazla Veri Bulunmamakta!**` });
                    pages += 1;
                    let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n\n");
                    await kanvekin.update({
                        components: [kanvekin_buttons], embeds: [
                            kanvekin_embed
                                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                                .setTimestamp()
                                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                                .setColor("Random")
                                .setTitle("Kullanıcının Sicil Verileri")
                                .setDescription(newData)]
                    })
                } else
                    if (kanvekin.customId == "kanvekin_back") {
                        if (pages == 1) return kanvekin.reply({ ephemeral: true, content: `İlk sayfadasın geriye gidemezsin!` });
                        pages -= 1;
                        let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n\n");
                        await kanvekin.update({
                            components: [kanvekin_buttons], embeds: [
                                kanvekin_embed
                                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                                    .setTimestamp()
                                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                                    .setColor("Random")
                                    .setTitle("Kullanıcının Sicil Verileri")
                                    .setDescription(newData)]
                        })
                    } else if (kanvekin.customId == "kanvekin_exit") {
                        kanvekin.reply({ ephemeral: true, content: `Panel başarıyla silindi!` })
                        mesaj.delete().catch((kanvekin) => { })
                        message.delete().catch((kanvekin) => { })
                    }
            })
        }


    }
}