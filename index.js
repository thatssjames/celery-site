const express = require('express');
const path = require('path');
const request = require('request');

const { aireq, imagegen, math } = require('./serviceshandler.js');

const app = express();
const PORT = 1037;

app.set('trust proxy', true);

app.use('/_astro', express.static(path.join(__dirname, '_astro')));
app.use('/pagefind', express.static(path.join(__dirname, 'pagefind')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.static(path.join(__dirname), {
    extensions: ['html'],
    setHeaders: function (res, path) {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'interest-cohort=()');
    next();
});

app.get('/apis/v1/httpTest', (req, res) => {
  res.json({ success: true });
});

app.get('/apis/v1/ai/:prompt', async (req, res) => {
    const prompt = req.params.prompt;
    const response = await aireq(prompt);
    res.json({ success: true, response: response });
});

app.get('/apis/v1/images/:query', async (req, res) => {
    const query = req.params.query;
    const response = await imagegen(query);
    res.json({ success: true, response: response });
});

app.get('/apis/v1/math/:expression', (req, res) => {
    const expression = req.params.expression;
    const response = math(expression);
    res.json({ success: true, response: response });
});

app.get('/apis/v1', (req, res) => {
   res.json({ success: true, message: "Celery Site is online!" }) 
});

app.get("/discord", (req, res) => {
    res.redirect('https://discord.gg/eahVAdqZ2j');
});

app.get("/invite", (req, res) => {
    res.redirect('https://discord.com/oauth2/authorize?client_id=');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'favicon.ico'));
});

app.get('/botcut.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'images', 'botcut.png'));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

        console.log(`
 _____                _       _ 
|  __ \\              | |     | |
| |__) |___  __ _  __| |_   _| |
|  _  // _ \\/ _\` |/ _\` | | | | |
| | \\ \\  __/ (_| | (_| | |_| |_|
|_|  \\_\\___|\\__,_|\\__,_|\\__, (_)
                         __/ |  
                        |___/   
        `);
        console.log("/-/-/-/       Celery Bot       /-/-/-/")
        console.log("/-/-/-/          Site          /-/-/-/")

app.listen(PORT, () => {
    console.log(`Express started on port ${PORT}`);
    require('./cdn.js')
});