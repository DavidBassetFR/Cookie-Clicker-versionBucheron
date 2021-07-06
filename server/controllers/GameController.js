const Game = require('../models/Game');
const Militia = require('../models/Militia');
const Sawmill = require('../models/Sawmill');
const Silo = require('../models/Silo');
const Wave = require('../models/Wave');

const GameController = {
    status:  (request, response) => {
        const { game } = request.session;
        // mettre à jour la partie
        Game.update(game)     
        // renvoyer le nouvel état de la partie
        response.json(game);
    },

    upgradeSawmill: (request, response) => {
        const { game } = request.session;
        Game.update(game) 
        // mettre à jour la partie, sinon on ne sera pas certain que le coût puisse être payé
        if (game.stock >= Sawmill.cost) {
          game.stock = game.stock - Sawmill.cost
          Sawmill.generate()
        }
        game.Sawmill.level = Sawmill.level;
        game.Sawmill.yield = Sawmill.yield;
        game.Sawmill.cost = Sawmill.cost;
        // si le stock permet de payer le coût
          // on retire le coût du stock
          // et on remplace la scierie actuelle par celle du niveau supérieur

        return response.redirect('/status');
    },

    upgradeSilo: (request, response) => {
        const { game } = request.session;

        // mettre à jour la partie
        Game.update(game) 
        if (game.stock >= Silo.cost) {
          game.stock = game.stock - Silo.cost
          Silo.generate(game.silo.level)
        }
        game.silo.level = Silo.level;
        game.silo.capacity = Silo.capacity;
        game.silo.cost = Silo.cost;
        // si la scierie 3 n'est pas construite, on redirige directement vers /status
        
        // sinon on vérifie si le joueur a le stock nécessaire
          // et on construit son entrepôt

        return response.redirect('/status');
    },
    upgradeMilice : (req, res) => {
     
      req.session.game.militia = req.session.game.militia || Game.generateMilice(req.session.game);
      const { game } = req.session;
      if (game.militia.level >= 1){
        game.stock -= Militia.upgrade.cost
        game.militia.cost = game.militia.upgrade.cost
      } else {
        game.stock -= Militia.cost
      }
      game.militia.level++
      game.militia.kill = game.militia.level;
      

      return res.redirect('/status');
    },
   /* startWave: (request, response) => {
      const { game } = request.session;
      // mettre à jour la partie
      Game.update(game)     
      // renvoyer le nouvel état de la partie

      Game.startWave(game);
      return response.redirect('/status');
    },*/
    initGame: async (request, response, next) => {
      request.session.game = request.session.game || Game.generate();
      
      if(request.session.game.silo.level >= 3 && request.session.game.Sawmill.level >= 4) {
      request.session.game.wave = request.session.game.wave || Game.generateWave(request.session.game);
      }


        return next() 
      },


      startWave: (request, response) => {
        const { game } = request.session;
       

        game.wave.wave++;
        game.wave.enemies += 5 + (1 * game.wave.level);
        if(game.wave.wave ===7){
          game.wave.wave = 1
          game.wave.level++
          game.hp = 500

        } 
  
        return response.redirect('/status');
      }
    };
    

module.exports = GameController;