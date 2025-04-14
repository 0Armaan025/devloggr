import express from 'express';
import open from 'open';
import axios from 'axios';

const CLIENT_ID = 'Ov23liUU7gvGyGV4n6f4';
const CLIENT_SECRET = 'c751481076ced95b29964dd9153d4ffaac45dfa4';

export function loginWithGitHub() {
    const app = express();

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user`;

    open(authUrl);

    app.get('/callback', async (req, res) => {
        const code = req.query.code;

        const tokenRes = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code
            },
            {
                headers: { Accept: 'application/json' }
            }
        );

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });

        console.log('Logged in as:', userRes.data.login);
        res.send(`Welcome, ${userRes.data.login}. You may close this.`);

        server.close();
    });

    const server = app.listen(5000, () => {
        console.log('Listening at http://localhost:5173');
    });
}
