const GameController = require('./controllers/GameController');
const Game = require('./models/Game');

const router = require('express').Router();

router.use(GameController.initGame);

router.get('/status', GameController.status);
router.get('/letgetenemies', GameController.startWave);
router.get('/sawmill/upgrade', GameController.upgradeSawmill);
router.get('/silo/upgrade', GameController.upgradeSilo);
router.get('/milice/upgrade', GameController.upgradeMilice);

module.exports = router;