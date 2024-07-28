const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: 'rol-log',
    usage: "rol-log [@rol]",
    category: "rol",
    aliases: ["rollog", "rlog", "r-log", "rolelog", "rolleri"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply({
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
        if (member.user.bot) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, botların rol geçmişine bakamazsın!`)]
        }).sil(5);
        let names = db.get(`rollog-${member.id}`).reverse();
        if (!names) return message.reply({
            embeds: [kanvekin_embed

                .setDescription(`${member} kullanıcısının rol verisi bulunmamakta!`)]
        }).sil(5);
        if (names && names.length <= 10) {
            message.reply({
                embeds: [kanvekin_embed
                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                    .setTimestamp()
                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                    .setColor("Random")
                    .setTitle("Kullanıcının Rol Geçmişi")
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
            client.true(message)
            let mesaj = await message.reply({
                components: [kanvekin_buttons], embeds: [
                    kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setColor("Random")
                        .setTitle("Kullanıcının Rol Geçmişi")
                        .setDescription(`${names.slice(pages == 1 ? 0 : pages * 5 - 5, pages * 5).join("\n\n")}`)
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })]
            })

            const filter = i => i.user.id === message.member.id;
            const collector = mesaj.createMessageComponentCollector({ filter: filter, time: 120000 });
            collector.on("collect", async (kanvekin) => {
                if (kanvekin.customId == "kanvekin_skip") {
                    if (names.slice((pages + 1) * 5 - 5, (pages + 1) * 5).length <= 0) return kanvekin.reply({ ephemeral: true, content: `Daha fazla veri bulunmamaktadır!` });
                    pages += 1;
                    let newData = names.slice(pages == 1 ? 0 : pages * 5 - 5, pages * 5).join("\n\n");
                    await kanvekin.update({
                        components: [kanvekin_buttons], embeds: [
                            kanvekin_embed
                                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                                .setTimestamp()
                                .setColor("Random")
                                .setTitle("Kullanıcının Rol Geçmişi")
                                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                                .setDescription(newData)]
                    })
                } else
                    if (kanvekin.customId == "kanvekin_back") {
                        if (pages == 1) return kanvekin.reply({ ephemeral: true, content: `İlk sayfadasın geriye gidemezsin!` });
                        pages -= 1;
                        let newData = names.slice(pages == 1 ? 0 : pages * 5 - 5, pages * 5).join("\n\n");
                        await kanvekin.update({
                            components: [kanvekin_buttons], embeds: [
                                kanvekin_embed
                                    .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                                    .setTimestamp()
                                    .setColor("Random")
                                    .setTitle("Kullanıcının Rol Geçmişi")
                                    .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                                    .setDescription(newData)]
                        })
                    } else if (kanvekin.customId == "kanvekin_exit") {
                        kanvekin.reply({ ephemeral: true, content: `Panel başarıyla kapamıştır!` })
                        mesaj.delete().catch((kanvekin) => { })
                        message.delete().catch((kanvekin) => { })
                    }
            })
        }

    }
}