const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const ms = require("ms");
const db = client.db;
module.exports = {
    name: "cmute",
    usage: "cmute [@kerem / ID] <süre[10m]> <sebep>",
    category: "moderasyon",
    aliases: ["cmute", "mute", "chat-mute", "chatmute", "çet-mute", "sustur"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let time = args[1];
        let reason = args.slice(2).join(' ');
        let cstaffData = await db.get("kanvekin-cmute-staff") || [];
        let vstaffData = await db.get("kanvekin-vmute-staff") || [];
        let muteRoles = await db.get("kanvekin-cmute-roles");
        let limitData = await db.get(`mutelimit-${message.author.id}`) || 0;
        if (!cstaffData.length > 0 || !vstaffData.length > 0) console.error("Chat Mute / Voice Mute Yetkilisi Ayarlı Değil!");
        if (!muteRoles) {
            console.error("Chat Mute Rolleri Ayarlı Değil!");
            return client.false(message);
        }
        if (!cstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !vstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply({
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
        if (member.id == message.author.id) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
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
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, kendinden üst veya aynı rolde olduğun kişilere işlem uygulayamazsın!`)]
        }).sil(5);
        if (!time || !["w", "d", "h", "m", "s"].some(kanvekin => time.includes(kanvekin))) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, geçerli bir süre belirtmen gerekiyor`)]
        }).sil(5);
        if (reason.length < 1) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, bir sebep belirtmen gerekiyor!`)]
        }).sil(5);
        if (!member.manageable) return message.reply({
            embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle('Bir hata oluştu')
                .setDescription(`Hey, belirttiğiniz kişiye işlem uygulamaya yetkim yetmiyor!`)]
        }).sil(5);
        let tip = time.replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")


        let buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Chat Mute")
                    .setDisabled(cstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) || message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.MuteMembers) ? member.roles.cache.has(muteRoles) ? true : false : true)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`${client.emoji("emote_cmute") !== null ? client.emoji("emote_cmute") : "🔕"}`)
                    .setCustomId("punish_cmute"),
                new ButtonBuilder()
                    .setLabel("Voice Mute")
                    .setDisabled(cstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) || message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.MuteMembers) ? !member.voice.channel ? true : member.voice.serverMute ? true : false : true)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`${client.emoji("emote_vmute") !== null ? client.emoji("emote_vmute") : "🔇"}`)
                    .setCustomId("punish_vmute"),
                new ButtonBuilder()
                    .setLabel("İptal")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`${client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌"}`)
                    .setCustomId("punish_iptal")
            )


        let mesaj = await message.reply({
            components: [buttons], embeds: [kanvekin_embed
                .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                .setTimestamp()
                .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                .setColor("Random")
                .setTitle(`Aşağıdaki butonlardan işlem seçiniz!`)]
        })
        const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000, max: 1 });
        collector.on('end', async (kanvekin) => {
            if (kanvekin.size == 0) mesaj.delete();
        })
        collector.on('collect', async (kanvekin) => {
            if (!kanvekin.isButton()) return;
            if (kanvekin.customId == "punish_cmute") {
                member.roles.add(muteRoles);
                db.set(`cmuted-${member.id}`, (Date.now() + ms(time)))
                await client.ceza(member.id, message, "CMUTE", reason, Date.now(), tip)
                mesaj.delete();
                db.add(`mutelimit-${message.author.id}`, 1);
            } else
                if (kanvekin.customId == "punish_vmute") {
                    if (!member.voice.channel) return kanvekin.reply({ content: `> Kullanıcı ses kanalında bulunmuyor!`, ephemeral: true })
                    member.voice.setMute(true)
                    db.set(`vmuted-${member.id}`, (Date.now() + ms(time)))
                    await client.ceza(member.id, message, "VMUTE", reason, Date.now(), tip)
                    mesaj.delete();
                    db.add(`mutelimit-${message.author.id}`, 1);
                } else
                    if (kanvekin.customId == "punish_iptal") {
                        kanvekin.reply({ content: `${client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅"} İşlem başarıyla iptal edildi!`, ephemeral: true })
                        client.false(message);
                        mesaj.delete();
                    }
        })


    }
}
