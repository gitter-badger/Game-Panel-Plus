const Installation = require("./modules/installation");

new Installation("csgo", "D:/servers/csgo1").then(() => {
    console.log("CSGO Server finished installing!");
});

new Installation("css", "D:/servers/css1").then(() => {
    console.log("CSS Server finished installing!");
});