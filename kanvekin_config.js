module.exports = {

    token: "", //Bot Tokeniniz => Bot Oluşturduktan Sonra Intentsleri Açmayı Unutma!
    guildID: "1258119074236469358", //Kullanıcağın Sunucunun ID'si
    voiceChannelID: "1259675168373215323", // Ses Kanal ID'si
    presence: "", //Botun Durumu
    footer: "Sancho", //Embedların Footer Yazısı
    botOwners: ["1260638594595291158","1157332387760443485"], //Bot Sahibinin ID'si
    prefix: ".", //Botun Prefix'i 
    banGif: "https://cdn.discordapp.com/avatars/867073097876897802/3a45820f9bffde364b83a954f9cbcddc.png?size=4096",
    shipArkaplan: "https://cdn.discordapp.com/avatars/1263569003939500092/2c47d44d65d64de0cd92058c63fc8acf.png?size=2048",

    //Eğer Buraya Kadar Yaptıysan .setup Komudunu Kullanarak Botu Sunucuna Kurmaya Başla.
    mongoURL: "mongodb+srv://cheystm:asel123@cluster0.rrdaszv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", //MongoDB URL'niz
    topArkaplan: "https://cdn.discordapp.com/avatars/867073097876897802/3a45820f9bffde364b83a954f9cbcddc.png?size=4096", //Top Komutundaki Arkaplan Resmi (URL Şeklinde Girilicek) - Eğer Hata Verirse Bilinki URL'de Resim Yoktur,Başka Bir URL Deneyin. (⚠️ GIF,APNG Uzantılı Resimleri Desteklemez)

    staffs: [""], // Yetkililerin Rol ID'leri ["11111","11111"] Şeklinde Girilir

    parents: { // Kategorilerin ID'leri ["11111","11111"] Şeklinde Çoklu Girilebilir
        publicParents: [""],
        solvingParents: [""],
        privateParents: [""],
        aloneParents: [""],
        funParents: [""]
    },



    //limit: {
        banLimit: 2,
        jailLimit: 3,
        muteLimit: 5,
    //},


    logs: [
        { name: "command-log" },
        { name: "ban-log" },
        { name: "vmute-log" },
        { name: "mute-log" },
        { name: "voice-log" },
        { name: "rol-log" },
        { name: "others-log" },
    ],
    emojis: [
        { name: "emote_hi", url: "https://cdn3.emoji.gg/emojis/80386-catwave.png" },
        { name: "emote_true", url: "https://cdn3.emoji.gg/emojis/9718_pixel_check_mark.png" },
        { name: "emote_false", url: "https://cdn3.emoji.gg/emojis/9145-w98-decline.png" },
        { name: "emote_warn", url: "https://cdn.discordapp.com/emojis/1258875515339542691.webp?size=128&quality=lossless" },
        { name: "emote_chat", url: "https://cdn3.emoji.gg/emojis/5566-speechbubble-what.png" },
        { name: "emote_invite", url: "https://cdn3.emoji.gg/emojis/1563-invite-people.png" },
        { name: "emote_voice", url: "https://cdn3.emoji.gg/emojis/66643-badlydrawnvoicechannel.png" },
        { name: "emote_value", url: "https://cdn3.emoji.gg/emojis/59435-pepepixel.png" },
        { name: "emote_others", url: "https://cdn.discordapp.com/emojis/1258875515339542691.webp?size=128&quality=lossless" },
        { name: "emote_cmute", url: "https://cdn3.emoji.gg/emojis/1626-chat-muted.png" },
        { name: "emote_vmute", url: "https://cdn3.emoji.gg/emojis/6787-microphone-muted-guild.png" },
        { name: "emote_zero", url: "https://cdn3.emoji.gg/emojis/6911-number-0.gif" },
        { name: "emote_one", url: "https://cdn3.emoji.gg/emojis/6322-number-1.gif" },
        { name: "emote_two", url: "https://cdn3.emoji.gg/emojis/1656-number-2.gif" },
        { name: "emote_three", url: "https://cdn3.emoji.gg/emojis/5370-number-3.gif" },
        { name: "emote_four", url: "https://cdn3.emoji.gg/emojis/9120-number-4.gif" },
        { name: "emote_five", url: "https://cdn3.emoji.gg/emojis/3422-number-5.gif" },
        { name: "emote_six", url: "https://cdn3.emoji.gg/emojis/8334-number-6.gif" },
        { name: "emote_seven", url: "https://cdn3.emoji.gg/emojis/3009-number-7.gif" },
        { name: "emote_eight", url: "https://cdn3.emoji.gg/emojis/8617-number-8.gif" },
        { name: "emote_nine", url: "https://cdn3.emoji.gg/emojis/4029-number-9.gif" },
    ],



}