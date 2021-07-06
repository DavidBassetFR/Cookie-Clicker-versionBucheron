const Enemies = require("./Enemies");

const Wave = {
    wave: 1,
    level : 1,
    enemies : 4,
    inXSecond: 10,
    upgrade: {
        enemies: 1 *  this.level,
    },
    howMuchWave : 6 
    
 
};

module.exports = Wave;