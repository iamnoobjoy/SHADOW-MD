const {
    shadow,
    sendPhoto,
    sendVoice,
    sendGif,
    sendBassAudio,
    sendSlowAudio,
    sendBlownAudio,
    sendDeepAudio,
    sendErrapeAudio,
    sendFastAudio,
    sendFatAudio,
    sendNightcoreAudio,
    sendReverseAudio,
    sendSquirrelAudio,
    toAudio,
    toPTT,
    toVideo,
    AudioMetaData,
    getLang
} = require('../lib');
let lang = getLang()
const {
    BASE_URL,
    AUDIO_DATA
} = require('../config');
shadow({
    pattern: 'photo',
    desc: lang.CONVERTER.PHOTO_DESC,
    type: "converter"
}, async (message) => {
    if (!message.quoted.stickerMessage) return  await message.reply(lang.BASE.NEED.format("non animated sticker message"));
    if(message.reply_message.isAnimatedSticker) return  await message.reply(lang.BASE.NEED.format("please reply to a non animated sticker"));
    return await sendPhoto(message);
});
shadow({
    pattern: 'mp4',
    desc: lang.CONVERTER.VIDEO_DESC,
    type: "converter"
}, async (message, match) => {
    if (!message.quoted.sticker) return message.reply(lang.BASE.NEED.format("animated sticker message"));
    if(!message.reply_message.isAnimatedSticker) return  await message.reply(lang.BASE.NEED.format("please reply to an animated sticker"));
    let media = await toVideo(await message.quoted.download())
    return await message.client.sendMessage(message.from, {
        video: media,
        mimetype: 'video/mp4',
    }, {
        quoted: message.quoted.data
    })
});
shadow({
    pattern: 'voice',
    desc: lang.CONVERTER.AUDIO_DESC,
    type: "converter"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("video/audio message"));
    let media = await toPTT(await message.quoted.download())
    return await message.client.sendMessage(message.from, {
        audio: media,
        mimetype: 'audio/mpeg',
        ptt: true
    }, {
        quoted: message
    })
});
shadow({
    pattern: 'gif',
    desc: lang.CONVERTER.GIF_DESC,
    type: "converter"
}, async (message) => {
    if (!message.quoted) return;
    if (!message.quoted.stickerMessage || message.quoted.videoMessage) return message.reply(lang.BASE.NEED.format("animated sticker/video message"));
    return await sendGif(message)
});
shadow({
    pattern: 'bass',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audio) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendBassAudio(message)
});
shadow({
    pattern: 'slow',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendSlowAudio(message)
});
shadow({
    pattern: 'blown',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendBlownAudio(message)
});
shadow({
    pattern: 'deep',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendDeepAudio(message);
});
shadow({
    pattern: 'earrape',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendErrapeAudio(message)
});
shadow({
    pattern: 'fast',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendFastAudio(message)
});
shadow({
    pattern: 'fat',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendFatAudio(message);
});
shadow({
    pattern: 'nightcore',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendNightcoreAudio(message);
});
shadow({
    pattern: 'reverse',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendReverseAudio(message);
});
shadow({
    pattern: 'squirrel',
    desc: lang.CONVERTER.AUDIO_EDIT_DESC,
    type: "audio-edit"
}, async (message) => {
    if (!message.quoted.audioMessage) return message.reply(lang.BASE.NEED.format("audio message"));
    return await sendSquirrelAudio(message);
});

shadow({
    pattern: 'mp3',
    desc: lang.CONVERTER.MP3_DESC,
    type: "converter"
}, (async (message) => {
    if (!message.quoted.audio && !message.quoted.video) return message.reply(lang.BASE.NEED.format("video message"));
    const opt = {
                title: AUDIO_DATA.split(/[|,;]/)[0] || AUDIO_DATA,
                body: AUDIO_DATA.split(/[|,;]/)[1],
                image: AUDIO_DATA.split(/[|,;]/)[2]
            }
    const AudioMeta = await AudioMetaData(await toAudio(await message.quoted.download()), opt);
    return await message.client.sendMessage(message.from, {
        audio: AudioMeta,
        mimetype: 'audio/mpeg'
    }, {
        quoted: message.quoted.data
    })
}));
