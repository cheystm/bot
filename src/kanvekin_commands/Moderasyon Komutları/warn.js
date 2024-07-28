const { PermissionFlagsBits } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "warn",
    usage: "warn [@kerem / ID] <sebep>",
    category: "moderasyon",
    aliases: ["warns", "uyarı", "uyar"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, bu komutu kullanabilmek içim gerekli izinlere sahip değilsin!`)]
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
        if (member.id == message.author.id) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu!')
                .setDescription(`Hey, kendine işlem uygulayamazsın!`)]
        }).sil(5);
        if (member.user.bot) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, botlara işlem uygulayamazsın!`)]
        }).sil(5);
        if (member.roles.highest.position > message.member.roles.highest.position) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)] }).sil(5);
        if (reason.length < 1) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, bir sebep belirtmen gerekiyor!`)]
        }).sil(5);
        if (!member.bannable) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, belirtilen kullanıcıya işlem yapmaya yetkim yetmiyor!`)]
        }).sil(5);

        await client.ceza(member.id, message, "WARN", reason, Date.now())

    }
}