const client = global.client;
const { EmbedBuilder, Events } = require("discord.js");
const kanvekin_config = require("../../kanvekin_config");
const db = client.db;
module.exports = async (oldState, newState) => {
    const log = client.kanalbul("voice-log");
    if (!log) return;
    if (!oldState.channel && newState.channel) return sender(`**${newState.member.displayName}  ${newState.channel} adlı kanala katıldı!**`, "#00ff00", log)
    if (oldState.channel && !newState.channel) return sender(`**${newState.member.displayName}  ${oldState.channel} adlı kanaldan ayrıldı!**`, "#ff0000", log)
    if (oldState.channel.id && newState.channel.id && oldState.channel.id != newState.channel.id) return sender(`**${newState.member.displayName} Kanalını Değiştirdi ${oldState.channel} -> ${newState.channel}**`, "#fdbf1f", log)
    if (oldState.channel.id && oldState.selfMute && !newState.selfMute) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda kendi susturmasını kaldırdı!**`, "#00ff00", log)
    if (oldState.channel.id && !oldState.selfMute && newState.selfMute) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda kendini dusturdu!**`, "#ff0000", log)
    if (oldState.channel.id && oldState.selfDeaf && !newState.selfDeaf) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda kendi sağırlaştırmasını kaldırdı!**`, "#00ff00", log)
    if (oldState.channel.id && !oldState.selfDeaf && newState.selfDeaf) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda kendini dağırlaştırdı!**`, "#ff0000", log)
    if (oldState.channel.id && !oldState.streaming && newState.channel.id && newState.streaming) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda yayın açtı!**`, "#00ff00", log)
    if (oldState.channel.id && oldState.streaming && newState.channel.id && !newState.streaming) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda yayını kapattı!**`, "#ff0000", log)
    if (oldState.channel.id && !oldState.selfVideo && newState.channel.id && newState.selfVideo) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda kamerasını açtı!**`, "#00ff00", log)
    if (oldState.channel.id && oldState.selfVideo && newState.channel.id && !newState.selfVideo) return sender(`**${newState.member.displayName} ${newState.channel} adlı kanalda kamerasını kapattı!**`, "#ff0000", log)

}
module.exports.conf = { name: Events.VoiceStateUpdate }

function sender(message, color, log) {
    let embed = new EmbedBuilder()
        .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
        .setTimestamp()
        .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
        .setColor("Random")
        .setDescription(message)
        .setColor(color !== null ? color : "Random")
        .addFields([{ name: "Zaman / Tarih", value: `**<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)**` }])
    log.send({ embeds: [embed] })
}