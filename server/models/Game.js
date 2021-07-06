const Sawmill = require('./Sawmill');
const Silo = require('./Silo');
const Wave = require('./Wave');

const Game = {
    generate: () => {
        return {
            hp : 500,
            stock: 0, 
            Sawmill :{ level : Sawmill.level, yield : Sawmill.yield , cost: Sawmill.cost,},
            silo : {level : Silo.level, capacity : Silo.capacity, cost: Silo.cost,},
            lastUpdate : (Date.now() /1000),
        };
    },
    //
    generateWave : (game) => {
        return {
                level : Wave.level,
                wave : Wave.wave,
                enemies : (Wave.enemies + (1 * Wave.level)),
                inXSecond : Wave.inXSecond,
                howMuchWave : Wave.howMuchWave,
            }
        },

    gameOver: () => {
        game.generate();
        },
    generateMilice: () => {
        return {
            level: 0,
            kill: this.level,
            cost : 30,
            upgrade :{
                cost : 150
            }
        }
        },
    update: (game) => {
        // 1. récupérer le timestamp Unix actuel en secondes
        // ATTENTION : JS fournit l'information en millisecondes, il faut diviser le nombre obtenu par 1000
        // sinon, vous allez générer 0.2 bois par millisecondes, soit 200 unités par seconde :-D
        const newDate = (Date.now() /1000);
        const delaiDeniereDemande= (newDate - game.lastUpdate)
        // 2. calculer le délai depuis la dernière demande
        // 3. mettre à jour la dernière demande
        game.lastUpdate = newDate
        // 4. augmenter le stock avec la production générée
        const stockProduit = (game.Sawmill.yield * delaiDeniereDemande)
        console.log(stockProduit)
        console.log(game);
        if(game.militia) {
            if (game.wave.enemies <= 0){
                game.wave.enemies = 0 ;
            } else {
            game.wave.enemies -= game.militia.kill 
            }}
        if(game.wave){

        degatSubit = game.wave.enemies * ((game.Sawmill.level * game.silo.level) / 75)
        game.hp -= (degatSubit * delaiDeniereDemande)

    }
        if(game.hp <= 0) {
            Game.gameOver();
        }
        
       /* if (game.wave.inXSecond){
            Wave.inXSecond =  game.wave.inXSecond -= delaiDeniereDemande;
        }
        if (game.wave.inXSecond <= 0){
            game.wave.inXSecond = 10;
            game.wave.howMuchWave -= 1
            game.wave.wave ++
            game.wave.enemies = (Wave.enemies + (1 * Wave.level))
            if(game.wave.howMuchWave <= 0){
                game.wave.wave = 1
                game.wave.level ++
                game.wave.enemies = game.wave.enemies + (1 * game.wave.level)          
            }
        } */
    
        // 5. sans dépasser la capacité de l'entrepôt
        if (game.stock + stockProduit > game.silo.capacity){
            game.stock = game.silo.capacity;
        } else {
            game.stock += stockProduit
            console.log(game.stock);
        }


        // un peu inutile, mais plus logique et souple
        return game;
    }
};

module.exports = Game;