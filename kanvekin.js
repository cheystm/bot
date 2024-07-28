const { Collection, EmbedBuilder, codeBlock, GuildMember } = require("discord.js");
const kanvekin_config = require("./kanvekin_config")
const { kanvekin } = require('./kanvekin_client');
const client = global.client = new kanvekin();

const { YamlDatabase, JsonDatabase } = require('five.db')
const db = client.db = new YamlDatabase();
const rdb = client.rdb = new JsonDatabase({ databasePath: "./ranks.json" });
client.ranks = rdb.has(`ranks`) ? rdb.get(`ranks`).sort((x, y) => x.point - y.point) : [];
client.tasks = rdb.get("tasks") || [];
const { readdir } = require("fs");
const { conf } = require("./src/kanvekin_events/joinEvent");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
const invites = client.invites = new Collection();
const task = require("./src/kanvekin_schemas/tasksSchema")
const point = require("./src/kanvekin_schemas/staffsSchema")
readdir("./src/kanvekin_commands/", (err, files) => {
  if (err) console.error(err)
  files.forEach(f => {
    readdir("./src/kanvekin_commands/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
        let kanvekin_prop = require(`./src/kanvekin_commands/${f}/` + file);
        console.log(`🧮 [KANVEKIN - COMMANDS] ${kanvekin_prop.name} Yüklendi!`);
        commands.set(kanvekin_prop.name, kanvekin_prop);
        kanvekin_prop.aliases.forEach(alias => { aliases.set(alias, kanvekin_prop.name); });
      });
    });
  });
});


readdir("./src/kanvekin_events", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let kanvekin_prop = require(`./src/kanvekin_events/${file}`);
    if (!kanvekin_prop.conf) return;
    client.on(kanvekin_prop.conf.name, kanvekin_prop);
    console.log(`📚 [KANVEKIN _ EVENTS] ${kanvekin_prop.conf.name} Yüklendi!`);
  });
});

readdir("./src/kanvekin_trackers", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let kanvekin_prop = require(`./src/kanvekin_trackers/${file}`);
    if (!kanvekin_prop.conf) return;
    client.on(kanvekin_prop.conf.name, kanvekin_prop);
    console.log(`📩 [KANVEKIN _ TRACKERS] ${kanvekin_prop.conf.name} Yüklendi!`);
  });
});
const mongoose = require("mongoose");
mongoose.connect(kanvekin_config.mongoURL, { useUnifiedTopology: true, useNewUrlParser: true }).catch((err) => { console.log("🔴 MONGO_URL Bağlantı Hatası"); });
mongoose.connection.on("connected", () => { console.log(`🟢 MONGO_URL Başarıyla Bağlanıldı`); });
mongoose.connection.on("error", (err) => { console.error("🔴 MONGO_URL Bağlantı Hatası; " + err); });
async function cMuteCheck() {
  let guild = await client.guilds.fetch(kanvekin_config.guildID)
  let data = db.all().filter(i => i.ID.startsWith("cmuted-"))
  if (data.length < 1) return;
  for (let i in data) {
    if (data[i].data && data[i].data !== null) {
      if (data[i].data <= Date.now()) {
        let id = data[i].ID.split("-")[1];
        let member = guild.members.cache.get(id);
        if (!member) return;
        let muterole = await db.get("kanvekin-cmute-roles");
        if (!muterole) return;
        let log = client.kanalbul("mute-log")
        if (!log) return;
        member.roles.remove(muterole).catch(err => { })
        db.delete(`cmuted-${member.user.id}`)
        return log.send({
          embeds: [new EmbedBuilder()
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member} adlı kullanıcının susturulma cezası bitti, susturulması kaldırıldı!**`)]
        })
      }
    }
  }
}
async function vMuteCheck() {
  let guild = await client.guilds.fetch(kanvekin_config.guildID)
  let data = db.all().filter(i => i.ID.startsWith("vmuted-"))
  if (data.length < 1) return;
  for (let i in data) {
    if (data[i].data && data[i].data !== null) {
      if (data[i].data <= Date.now()) {
        let id = data[i].ID.split("-")[1];
        let member = guild.members.cache.get(id);
        if (!member) return;
        if (!member.voice.channel) return;
        let log = client.kanalbul("vmute-log")
        if (!log) return;
        member.voice.setMute(false).catch(err => { })
        db.delete(`vmuted-${member.user.id}`)
        return log.send({
          embeds: [new EmbedBuilder()
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member} adlı kullanıcının susturulma cezası bitti, susturulması kaldırıldı!**`)]
        })
      }
    }
  }
}

setInterval(async () => {
  await cMuteCheck();
  await vMuteCheck();
}, 3000);

Collection.prototype.array = function () { return [...this.values()] }

const { emitWarning } = process;
process.emitWarning = (warning, ...args) => {
  if (args[0] === 'ExperimentalWarning') { return; }
  if (args[0] === "TimeoutOverflowWarning") { return; }
  if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') { return; }
  return emitWarning(warning, ...args);
};

Promise.prototype.sil = function (time) {
  if (this) this.then(s => {
    if (s.deletable) {
      setTimeout(async () => {
        s.delete().catch(e => { });
      }, time * 1000)
    }
  });
};

client.splitMessage = function (kanvekin, size) {
  const xChunks = Math.ceil(kanvekin.length / size)
  const chunks = new Array(xChunks)
  for (let i = 0, c = 0; i < xChunks; ++i, c += size) {
    chunks[i] = kanvekin.substr(c, size)
  }
  return chunks
}

client.true = function (message) {
  if (message) { message.react(client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅") }
};

client.false = function (message) {
  if (message) { message.react(client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌") }
};


client.ceza = async function (id, message, type, reason, durations, süre) {
  let cezaıd = db.get(`cezaid`) || 1;
  db.add(`cezaid`, 1);
  let member = await client.users.fetch(id);
  let yapan = client.guilds.cache.get(kanvekin_config.guildID).members.cache.get(message.author.id);
  if (!member) return message.react(client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌");
  message.react(client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅")
  let duration = Math.floor(durations / 1000);
  if (!type.includes("UN")) db.push(`sicil-${member.id}`, `**[${type}]** \`${yapan.user.tag}\` Tarafından **<t:${duration}> (<t:${duration}:R>)** Zamanında **"${reason}"** Sebebiyle.`)
  let embed = new EmbedBuilder()

    .setColor("Random")
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
    .setFooter({ text: kanvekin_config.footer ? kanvekin_config.footer : `kanvekin Was Here`, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
  switch (type) {
    case 'BAN':
      message.reply({
        embeds: [embed

          .setDescription(`**${member.tag} Kullanıcısı ${yapan} tarafından \`${reason}\` sebebiyle sunucudan yasaklandı!**\n **\`(Ceza Numarası; #${cezaıd}\`)**`)
          .setImage(kanvekin_config.banGif)]
      })
      if (client.kanalbul("ban-log")) {
        client.kanalbul("ban-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`> **${member.tag} kullanıcısı [${type}] cezası aldı!**`)
            .addFields(
              { name: `Banlanan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Banliyan Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            ).setImage(null)]
        })
      }
      break;
    case 'WARN':
      message.reply({
        embeds: [embed
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`**${member.tag} kullanıcısı ${yapan} tarafından \`${reason}\` sebebiyle uyarıldı!**\n **\`(Ceza Numarası; #${cezaıd}\`)**`)
          .setImage(kanvekin_config.banGif)]
      })
      if (client.kanalbul("others-log")) {
        client.kanalbul("others-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısı [${type}] cezası aldı!**`)
            .addFields(
              { name: `Uyarılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Uyaran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            ).setImage(null)]
        })
      }
      break;
    case 'JAIL':
      message.reply({
        embeds: [embed
          .setDescription(`> **${member.tag} kullanıcısı ${yapan} tarafından \`${reason}\` sebebiyle cezalıya atıldı!**\n **\`(Ceza Numarası; #${cezaıd}\`)**`)]
      })
      db.set(`aktifceza-${member.id}`, "JAIL")
      if (client.kanalbul("jail-log")) {
        client.kanalbul("jail-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısı [${type}] cezası aldı!**`)
            .addFields(
              { name: `Kullanıcı`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Moderatör`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            )]
        })
      }
      break;
    case 'VMUTE':
      message.reply({
        embeds: [embed
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`**${member.tag} Kullanıcısı ${yapan} tarafından \`${reason}\` sebebiyle ${süre} boyunca ses kanallarında susturuldu!**\n **\`(Ceza Numarası; #${cezaıd}\`)**`)]
      })
      db.set(`aktifceza-${member.id}`, "VMUTE")
      if (client.kanalbul("vmute-log")) {
        client.kanalbul("vmute-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${süre} Boyunca [${type}] Cezası Aldı!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`).addFields(
            { name: `Kullanıcı`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Moderatör`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Süre`, value: codeBlock("fix", süre), inline: false },
            { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'CMUTE':
      message.reply({
        embeds: [embed
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`**${member.tag} kullanıcısı ${yapan} tarafından \`${reason}\` sebebiyle ${süre} boyunca Chat kanallarında susturuldu!**\n **\`(Ceza Numarası; #${cezaıd}\`)**`)]
      })
      db.set(`aktifceza-${member.id}`, "CMUTE")
      if (client.kanalbul("mute-log")) {
        client.kanalbul("mute-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısı ${süre} boyunca [${type}] cezası aldı!**`)
            .addFields(
              { name: `Kullanıcı`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Moderatör`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Süre`, value: codeBlock("fix", süre), inline: false },
              { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            )]
        })
      }
      break;
    case 'FORCEBAN':
      message.reply({
        embeds: [embed
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`**${member.tag} kullanıcısı ${yapan} tarafından \`${reason}\` sebebiyle sunucudan kalıcı olarak yasaklandı!**\n **\`(Ceza Numarası; #${cezaıd}\`)**`)]
      })
      if (client.kanalbul("others-log")) {
        client.kanalbul("others-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısı [${type}] cezası aldı!**`)
            .addFields(
              { name: `Kullanıcı`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Moderatör`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            )]
        })
      }
      db.push(`forcebans`, member.id)
      break;
    case 'UNFORCEBAN':
      message.reply({
        embeds: [embed
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`**${member.tag} kullanıcısının ${yapan} tarafından \`FORCEBAN\` cezası kaldırıldı!**`)]
      })
      if (client.kanalbul("others-log")) {
        client.kanalbul("others-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048',})   
     .setTimestamp()
     .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
     .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısının [FORCEBAN] cezası kaldırıldı!**`)
            .addFields(
            { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'UNJAIL':
      message.reply({
        embeds: [embed
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`**${member.tag} kullanıcısının ${yapan} tarafından \`JAIL\` cezası kaldırıldı!**`)]
      })
      if (client.kanalbul("jail-log")) {
        client.kanalbul("jail-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısının [JAIL] cezası kaldırıldı!**`)
            .addFields(
              { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            )]
        })
      }
      break;
    case 'UNCMUTE':
      message.reply({
        embeds: [embed
          .setDescription(`**${member.tag} kullanıcısının ${yapan} tarafından \`CMUTE\` cezası kaldırıldı!**`)]
      })
      if (client.kanalbul("mute-log")) {
        client.kanalbul("mute-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} Kullanıcısının chat mute cezası kaldırıldı!**`)
            .addFields(
              { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            )]
        })
      }
      break;
    case 'UNVMUTE':
      message.reply({
        embeds: [embed
          .setDescription(`**${member.tag} kullanıcısının ${yapan} tarafından \`VMUTE\` cezası kaldırıldı!**`)]
      })
      if (client.kanalbul("vmute-log")) {
        client.kanalbul("vmute-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısının Voice Mute cezası kaldırıldı!**`)
            .addFields(
              { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            )]
        })
      }
      break;
    case 'UNBAN':
      message.reply({
        embeds: [embed
          .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
          .setTimestamp()
          .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
          .setColor("Random")
          .setDescription(`**${member.tag} kullanıcısının ${yapan} tarafından \`BAN\` cezası kaldırıldı!**`)]
      })
      if (client.kanalbul("ban-log")) {
        client.kanalbul("ban-log").send({
          embeds: [embed
            .setAuthor({ name: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048', })
            .setTimestamp()
            .setFooter({ text: 'Sancho', iconURL: 'https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048' })
            .setColor("Random")
            .setDescription(`**${member.tag} kullanıcısının Ban cezası kaldırıldı!**`)
            .addFields(
              { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
              { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
              { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
            )]
        })
      }
      break;
  }
}

client.kanalbul = function (kanalisim) {
  let kanal = client.guilds.cache.get(kanvekin_config.guildID).channels.cache.find(kanvekin => kanvekin.name === kanalisim)
  if (!kanal) return false;
  return kanal;
}

client.rolbul = function (rolisim) {
  let rol = client.guilds.cache.get(kanvekin_config.guildID).roles.cache.find(kanvekin => kanvekin.name === rolisim)
  if (!rol) return false;
  return rol;
}

client.rolinc = function (rolinc) {
  let rol = client.guilds.cache.get(kanvekin_config.guildID).roles.cache.find(kanvekin => kanvekin.name.toLowerCase().includes(rolinc))
  if (!rol) return false;
  return rol;
}

client.emoji = function (name) {
  let emoji = client.guilds.cache.get(kanvekin_config.guildID).emojis.cache.find(kanvekin => kanvekin.name == name)
  if (!emoji) return null;
  return emoji;
}

client.sayıEmoji = (sayi) => {
  var kanvekin = sayi.toString().replace(/ /g, "     ");
  var kanvekin2 = kanvekin.match(/([0-9])/g);
  kanvekin = kanvekin.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
  if (kanvekin2) {
    kanvekin = kanvekin.replace(/([0-9])/g, d => {
      return {
        '0': client.emoji("emote_zero") !== null ? client.emoji("emote_zero") : "0",
        '1': client.emoji("emote_one") !== null ? client.emoji("emote_one") : "1",
        '2': client.emoji("emote_two") !== null ? client.emoji("emote_two") : "2",
        '3': client.emoji("emote_three") !== null ? client.emoji("emote_three") : "3",
        '4': client.emoji("emote_four") !== null ? client.emoji("emote_four") : "4",
        '5': client.emoji("emote_five") !== null ? client.emoji("emote_five") : "5",
        '6': client.emoji("emote_six") !== null ? client.emoji("emote_six") : "6",
        '7': client.emoji("emote_seven") !== null ? client.emoji("emote_seven") : "7",
        '8': client.emoji("emote_eight") !== null ? client.emoji("emote_eight") : "8",
        '9': client.emoji("emote_nine") !== null ? client.emoji("emote_nine") : "9"
      }[d];
    });
  }
  return kanvekin;
}

Array.prototype.listRoles = function (type = "mention") {
  return this.length > 1
    ? this.slice(0, -1)
      .map((x) => `<@&${x}>`)
      .join(", ") +
    " ve " +
    this.map((x) => `<@&${x}>`).slice(-1)
    : this.map((x) => `<@&${x}>`).join("");
};

GuildMember.prototype.hasRole = function (role, every = true) {
  return (
    (Array.isArray(role) && ((every && role.every((x) => this.roles.cache.has(x))) || (!every && role.some((x) => this.roles.cache.has(x))))) || (!Array.isArray(role) && this.roles.cache.has(role))
  );
};

client.progressBar = (value, maxValue, size) => {
  const progress = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
  const emptyProgress = size - progress > 0 ? size - progress : 0;

  const progressText = `${client.emoji("emote_fill")}`.repeat(progress);
  const emptyProgressText = `${client.emoji("emote_empty")}`.repeat(emptyProgress);

  return emptyProgress > 0
    ? progress === 0
      ? `${client.emoji("emote_emptystart")}` + progressText + emptyProgressText + `${client.emoji("emote_emptyend")}`
      : `${client.emoji("emote_fillstart")}` + progressText + emptyProgressText + `${client.emoji("emote_emptyend")}`
    : `${client.emoji("emote_fillstart")}` + progressText + emptyProgressText + `${client.emoji("emote_fillend")}`;
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.last = function () {
  return this[this.length - 1];
};



client.login(env.token).then(() =>
  console.log(`🟢 ${client.user.tag} Başarıyla Giriş Yaptı!`)
).catch((kanvekin_err) => console.log(`🔴 Bot Giriş Yapamadı / Sebep: ${kanvekin_err}`));

const express = require('express');
const app = express();
const port = 3000;

app.get ('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`sunucu $port numaralı bağlantı noktasında yürütülüyor`)
});
