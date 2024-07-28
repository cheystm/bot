const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "rol-bilgi",
    usage: "rol-bilgi [@Rol / ID]",
    category: "rol",
    aliases: ["rbilgi", "rolbilgi", "r-bilgi", "rinfo", "rolinfo", "rol-info"],
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
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setTitle('Bir hata oluştu')
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setDescription('Hey, bu komutu kullanmak için rol belirtmen gerekiyor! `örneğin: .rolbilgi @rol veya rolid`')]
        }).sil(5);

        message.reply({
            embeds: [kanvekin_embed

                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setThumbnail(`http://colorhexa.com/${role.hexColor.toString().slice(1)}.png`)
                .addFields(
                    { name: `Rol İsmi`, value: `**\`${role.name}\`**`, inline: false },
                    { name: `Rol ID`, value: `**\`${role.id}\`**`, inline: false },
                    { name: `Rol Tag`, value: `**${role}**`, inline: false },
                    { name: `Rol Renk`, value: `**${role.hexColor}**`, inline: false },
                    { name: `Etiketlenebilir mi?`, value: `**\`${role.mentionable ? 'Evet' : 'Hayır'}\`**`, inline: false },
                    { name: `Role Sahip Kullanıcı Sayısı`, value: `**\`${role.members.size}\`**`, inline: false },
                    { name: `Role Sahip Kullanıcılar`, value: `${role.members.size > 30 ? "\`30 Kişiden Fazla Olduğu İçin Gösteremiyorum\`" : message.guild.members.cache.filter(member => member.roles.cache.has(role.id)).map(member => `${member}`).join(",")}`, inline: false },
                )]
        });
    }
}
