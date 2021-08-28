const node_dir = require('node-dir');

module.exports = (client) => {
    console.log("Jentre dans event handler");
    let eventFiles = node_dir.files('./events', {sync:true}).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`../${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
    console.log("Jai passé le event handler");
};
