const client = global.client;
const db = client.db;
const { EmbedBuilder, Events, AuditLogEvent, codeBlock } = require("discord.js");
const kanvekin_config = require("../../kanvekin_config");
const ms = require('ms');
module.exports = async (oldMember, newMember) => {
    if (newMember.guild.id == kanvekin_config.guildID) {
        newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate }).then(async (audit) => {
            let ent = audit.entries.first()
            let user = ent.target;
            let maker = ent.executor;
            if (maker.bot || user.bot || !ent) return
            newMember.roles.cache.forEach(async role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    db.push(`rollog-${user.id}`, `\`[+]\` ${maker} (\`${maker.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Rol;* ${role} (\`${role.id}\`)`)
                    if (client.kanalbul("rol-log")) client.kanalbul("rol-log").send({
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                            .setTimestamp()
                            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                            .setColor("Random")
                            .setDescription(`**${user} kullanıcısına ${role} rolü verildi!**`)
                            .addFields(
                                { name: `Veren Kişi`, value: `${codeBlock("diff", maker.tag + " / " + maker.id)}`, inline: false },
                                { name: `Verilen Kişi`, value: `${codeBlock("diff", user.tag + " / " + user.id)}`, inline: false },
                                { name: `Verilen Rol`, value: `${role} (\`${role.id}\`)`, inline: false }
                            )]
                    })
                }
            })

            oldMember.roles.cache.forEach(async role => {
                if (!newMember.roles.cache.has(role.id)) {
                    db.push(`rollog-${user.id}`, `\`[-]\` ${maker} (\`${maker.id}\`)\n*Tarih;* **<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**\n*Rol;* ${role} (\`${role.id}\`)`)
                    if (client.kanalbul("rol-log")) client.kanalbul("rol-log").send({
                        embeds: [new EmbedBuilder()
                            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
                            .setTimestamp()
                            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
                            .setColor("Random")
                            .setDescription(`**${user} kullanıcısından ${role} rolü alındı!**`)
                            .addFields(
                                { name: `Alan Kişi`, value: `${codeBlock("diff", maker.tag + " / " + maker.id)}`, inline: false },
                                { name: `Alınan Kişi`, value: `${codeBlock("diff", user.tag + " / " + user.id)}`, inline: false },
                                { name: `Alınan Rol`, value: `${role} (\`${role.id}\`)`, inline: false }
                            )]
                    })
                }
            })

        })
    }

}
module.exports.conf = { name: Events.GuildMemberUpdate }