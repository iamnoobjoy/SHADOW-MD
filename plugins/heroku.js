const simpleGit = require('simple-git');
const git = simpleGit();
const Config = require('../config');
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const axios = require("axios");
const {
        PassThrough
} = require('stream');
const heroku = new Heroku({
        token: process.env.HEROKU_API_KEY
})
//function used
function secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
}
const {
        shadow,
        GenListMessage,
        getLang
} = require('../lib');
let lang = getLang()

shadow({
        pattern: 'shutdown$',
        fromMe: true,
        dontAddCommandList: true,
        use: 'owner'
}, (async (message) => {
        if (!process.env.HEROKU_API_KEY) {
                return await pm2.stop("shadow");
        } else if (process.env.HEROKU_API_KEY) {
                await heroku.get('/apps/' + process.env.HEROKU_APP_NAME + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await message.send("_Shutting down_")
                        await heroku.patch('/apps/' + process.env.HEROKU_APP_NAME + '/formation/' + forID, {
                                body: {
                                        quantity: 0
                                }
                        });
                }).catch(async (err) => {
                        await message.send(err.message)
                });
        } else return await message.send("_This is a heroku command, but this bot is not running on heroku!_");
}));
shadow({
        pattern: 'setvar ?(.*)',
        fromMe: true,
        desc: 'Set heroku config var',
        type: 'heroku'
}, async (message, match) => {
        if (!match) return await message.send('```Either Key or Value is missing```');
        const [key, value] = match.split(':');
        if (!key || !value) return await message.send('setvar STICKER_DATA: shadow;md');
        await heroku.patch('/apps/' + process.env.HEROKU_APP_NAME + '/config-vars', {
                body: {
                        [key.trim().toUpperCase()]: match.replace(key,'').replace(':','').trim()
                }
        }).then(async () => {
                await message.send('Successfully Set ' + '```' + key + '➜' + match.replace(key,'').replace(':','').trim() + '```')
        }).catch(async (error) => {
                await message.send(`HEROKU : ${error.body.message}`)
        })
})
shadow({
        pattern: 'delvar ?(.*)',
        fromMe: true,
        desc: 'Delete heroku config var',
        type: 'heroku'
}, async (message, match) => {
        if (!match) return await message.send('```Either Key or Value is missing```');
        await heroku.get('/apps/' + process.env.HEROKU_APP_NAME + '/config-vars').then(async (vars) => {
                for (vr in vars) {
                        if (match == vr) {
                                await heroku.patch('/apps/' + process.env.HEROKU_APP_NAME + '/config-vars', {
                                        body: {
                                                [match.toUpperCase()]: null
                                        }
                                });
                                return await message.send('```{} successfully deleted```'.replace('{}', match));
                        }
                }
                await message.send('```No results found for this key```');
        }).catch(async (error) => {
                await message.send(`HEROKU : ${error.body.message}`);
        });
});
