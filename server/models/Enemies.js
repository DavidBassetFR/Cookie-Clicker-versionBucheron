const Sawmill = require("./Sawmill");
const Silo = require("./Silo");

const Enemies = {
    level: 0,
    hp: 50,
    damage: ((Sawmill.level * Silo.level) /75),
    };

module.exports = Enemies;