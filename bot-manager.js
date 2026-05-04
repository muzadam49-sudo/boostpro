const SteamUser = require('steam-user');

const activeBots = {};

function startBoost(account) {
    const client = new SteamUser();
    
    client.logOn({
        accountName: account.steamUser,
        password: account.steamPass
    });

    client.on('loggedOn', () => {
        console.log(`${account.steamUser} giriş yaptı.`);
        client.setPersona(SteamUser.EPersonaState.Online);
        client.gamesPlayed(account.games.map(id => parseInt(id.trim())));
        activeBots[account.steamUser] = client;
    });

    client.on('error', (err) => console.log("Steam Hatası: " + err.message));
}

module.exports = { startBoost };