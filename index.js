const env = require('dotenv').config();
const SpotifyAPI = require('spotify-web-api-node')
const chalk = require('chalk');
const log = console.log;
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var spotify = new SpotifyAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SEC
});

log(chalk.bold(chalk.cyan("Welcome to NOISE")));

authAndProcess();


async function authAndProcess() {
    await spotify.clientCredentialsGrant().then((e) => {
        if (e.statusCode == 200) {
            log(chalk.greenBright("Authroization Successful"))
            spotify.setAccessToken(e.body.access_token);
        } else {
            log(chalk.red("Auth Failed."));
            process.exit();
        }
    });

    rl.question('Enter the artist ID: ', (answer) => {
        rl.close()
        findArtist(answer);
    });

}
async function findArtist(id) {
    await spotify.getArtistAlbums(id).then((e) => {
        if (e.statusCode == 200) {
            e.body.items.forEach(element => {
                if (element.images) {
                    log(chalk.inverse(element.name + ": ") + chalk.magenta(element.images[0].url));
                }
            });
        }
    });
}