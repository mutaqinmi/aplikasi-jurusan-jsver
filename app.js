const fastify = require('fastify')();
const path = require('path');
const time = require('moment')();

fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})

fastify.get('/', (req, res) => {
    res.redirect('/peminjaman-laptop')
})

fastify.get('/peminjaman-laptop', (req, res) => {
    res.view("/views/peminjaman-laptop.ejs", {
        time: time.format("YYYY-MM-DDTHH:mm"),
    })
})

fastify.listen({port:8000}, () => {
    console.log("Site running at port 8000");
})