const { PermissionFlagsBits } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "unban",
    usage: "unban [@kerem / ID]",
    category: "moderasyon",
    aliases: ["un-ban", "unyasakla", "unyasaklama", "bankaldır", "ban-kaldır", "yasaklama-kaldır"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let staffData = await db.get("kanvekin-ban-staff") || [];
        let limitData = await db.get(`banlimit-${message.author.id}`) || 0;
        let forcedata = await db.get(`forcebans`) || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");

        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setDescription(`Hey, bu komutu kullanabilmek için gerekli izinlere sahip değilsin!`)]
        }).sil(5);
        if (!member) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, geçerli bir kullanıcı belirtmelisin!`)]
        }).sil(5);
        if (member.id == message.author.id) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, kendine işlem uygulayamazsın!`)]
        }).sil(5);
        if (forcedata.includes(member.id)) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, belirtilen kişinin kalıcı yasaklaması bulunmaktadır /n Yasaklamayı kaldırmak için üst yönetime ulaşınız!`)]
        }).sil(5);

        const fetchBans = message.guild.bans.fetch()
        fetchBans.then(async (bans) => {
            let ban = await bans.find(a => a.user.id === member.id)
            if (!ban) {
                return message.reply({
                    embeds: [kanvekin_embed
                        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                        .setTimestamp()
                        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                        .setColor("Random")
                        .setTitle('Bir hata oluştu')
                        .setDescription(`Hey, belirtilen kişinin yasaklanması bulunmamaktadır!`)]
                }).sil(5);
            } else {
                message.guild.members.unban(member.id);
                await client.ceza(member.id, message, "UNBAN", null, Date.now())
            }
        })

    }
}