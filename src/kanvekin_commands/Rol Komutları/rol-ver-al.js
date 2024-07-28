const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, codeBlock } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "rol",
    usage: "rol ver / al [@kerem / ID] [@Rol / ID]",
    category: "rol",
    aliases: ["rol-işlem", "r"],
    execute: async (client, message, args, kanvekin_embed) => {
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setTitle('Bir hata oluştu')
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setDescription(`Hey, bu komutu kullanabilmek için gerekli izinlere sahip değilsin!`)]
        }).sil(5);
        if (!args[0]) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Eksik argüman girildi!\n> \`${kanvekin_config.prefix}rol ver / al @kullanıcı @rol\``)]
        }).sil(5);
        if (args[0] != "al") {
            if (args[0] != "ver") {
                return message.reply({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setTitle('Bir hata oluştu')
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setDescription(`Eksik argüman girildi!**\n> \`${kanvekin_config.prefix}rol ver / al @kullanıcı @rol\``)]
                }).sil(5);
            }
        }
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!user) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, bir kullanıcı belirtmelisin!`)]
        }).sil(5);
        if (user.user.bot) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, botlara rol veremez yada alamazsın!`)]
        }).sil(5);
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
        if (!role) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, geçerli bir rol belirtmelisin`)]
        }).sil(5);
        if (message.member.roles.highest.rawPosition <= role.rawPosition) return message.reply("Rol kendi rolünden üst/eşit durumda işlem geçersiz.")
        if (!role.editable) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setTitle('Bir hata oluştu')
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setDescription(`Hey, belirtilen rol benden üstün olduğu için işlem yapamıyorum!`)]
        }).sil(5);
        if (args[0] == "al") {
            if (user.roles.cache.has(role.id)) {
                user.roles.remove(role.id)
                client.true(message)
                db.push(`rollog-${user.id}`, `\`[-]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Rol;* ${role} (\`${role.id}\`)`)
                if (client.kanalbul("rol-log")) client.kanalbul("rol-log").send({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setDescription(`${user} kullanıcısından ${role} rolü alındı!`)
                        .addFields(
                            { name: `Moderatör`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                            { name: `Kullanıcı`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                            { name: `Alınan Rol`, value: `${role} (\`${role.id}\`)`, inline: false }
                        )]
                })
            } else {
                client.false(message)
                return message.reply({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setTitle('Bir hata oluştu')
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setDescription(`${user} kullanıcısında ${role} rolü mevcut değil!**`)]
                }).sil(5);
            }
        }
        if (args[0] == "ver") {
            if (!user.roles.cache.has(role.id)) {
                user.roles.add(role.id)
                client.true(message)
                db.push(`rollog-${user.id}`, `\`[+]\` ${message.author} (\`${message.author.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Rol;* ${role} (\`${role.id}\`)`)
                if (client.kanalbul("rol-log")) client.kanalbul("rol-log").send({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setDescription(`${user} kullanıcısına ${role} rolü verildi!`)
                        .addFields(
                            { name: `Moderatör`, value: `${codeBlock("diff", message.author.tag + " / " + message.author.id)}`, inline: false },
                            { name: `Kullanıcı`, value: `${codeBlock("diff", user.user.tag + " / " + user.id)}`, inline: false },
                            { name: `Verilen Rol`, value: `${role} (\`${role.id}\`)`, inline: false }
                        )]
                })
            } else {
                client.false(message)
                return message.reply({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setTitle('Bir hata oluştu')
                        .setDescription(`${user} kullanıcısında ${role} rolü zaten mevcut!`)]
                }).sil(5);
            }
        }
    }
}
