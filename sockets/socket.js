const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('ColdPlay'));
bands.addBand(new Band('Green Day'));


console.log('Init Service');
//Mensajes de Sockets
io.on('connection', client => {

    console.log('Client Connected');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Client Disconnected');
    });

    //Listening values that was emited.
    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        //The server emit a message to all clients connected to the server
        io.emit('mensaje', { admin: 'New Message' })
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', (payload) => {
        console.log(payload);
        const newband = new Band(payload.name);
        bands.addBand(newband);
        io.emit('active-bands', bands.getBands());

    });

    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });




    // client.on('emitir-mensaje', ( payload ) => {
    //       //console.log(payload);
    //      // io.emit('nuevo-mensaje', payload ); // emite a todos!
    //         client.broadcast.emit('nuevo-mensaje', payload ); // emite a todos menos el que lo emitió
    //  })


});
