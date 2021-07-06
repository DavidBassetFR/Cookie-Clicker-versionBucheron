

const app = {
    baseUrl: 'http://localhost:8888',
    gameState: {},
    timing : null,
    init:  async () => {
        app.bindElements();
        app.bindActions();
        await app.loadGameState();
        console.log(app.gameState);
        setInterval(app.updateGameState, 1000);
        //app.updateWaveState()
        if(app.gameState.silo.level >= 3 && app.gameState.Sawmill.level >= 4){
            console.log(app.timing)
             app.timing = setInterval(app.updateWaveState, 10000);
             console.log(app.timing)
        }
    },

    bindElements: () => {

        app.outputs = {
            yield: document.getElementById('stat-lumbering'),
            stock: document.getElementById('stat-lumber'),
            sawmill: document.getElementById('stat-sawmill-level'),
            silo: document.getElementById('stat-silo-level'),
            wave: document.getElementById('stat-next-wave'),
            enemies: document.getElementById('stat-enemies'),
            defense: document.getElementById('stat-defense-level'),
            militia: document.getElementById('stat-militia-level'),
            statHp: document.getElementById('stat-hp'),
        };

        app.buttons = {
            sawmill: document.getElementById('action-upgrade-sawmill'),
            silo: document.getElementById('action-upgrade-silo'),
            defense: document.getElementById('action-upgrade-defense'),
            militia: document.getElementById('action-upgrade-militia')
        };
    },
    bindActions: () => {
        app.buttons.sawmill.addEventListener('click', app.handleSawmillClick);
        app.buttons.silo.addEventListener('click', app.handleSiloClick);
        app.buttons.militia.addEventListener('click', app.handleMiliceClick);
    },
    loadGameState: async () => {
        const state = await fetch('http://localhost:8888/status', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;
        console.log(state);
        console.log(app.gameState)

        // si l'heure locale et celle du serveur ne coïncident pas, on peut afficher des informations fausses
        app.gameState.lastUpdate = Math.round(Date.now() / 1000);

        app.updateUI(state);
    },
    updateUI: (state) => {
        app.outputs.stock.textContent = state.stock.toFixed(0) + "/" + state.silo.capacity.toFixed(0);
        app.outputs.yield.textContent = state.Sawmill.yield.toFixed(2) + "/s";
        app.outputs.sawmill.textContent = state.Sawmill.level;
        app.outputs.silo.textContent = state.silo.level;
        app.outputs.statHp.textContent = `Vous avez ${state.hp} points de vie`

        app.buttons.sawmill.innerHTML = `${state.Sawmill.level > 0?'Améliorer la scierie':'Construire une scierie'} pour ${state.Sawmill.cost.toFixed(2)} <img src="./lumber.png">`;
        app.buttons.silo.innerHTML = `${state.silo.level > 0?'Améliorer l\'entrepôt':'Construire un entrepôt'} pour ${state.silo.cost.toFixed(2)} <img src="./lumber.png">`;
        
        if (state.stock >= state.Sawmill.cost) {
            app.buttons.sawmill.removeAttribute('disabled');
        } else {
            app.buttons.sawmill.setAttribute('disabled', 'disabled');
        }

        if (state.Sawmill.level > 2) {
            app.buttons.silo.classList.add('available');
        }

        if (state.stock >= state.silo.cost) {
            app.buttons.silo.removeAttribute('disabled');
        } else {
            app.buttons.silo.setAttribute('disabled', 'disabled');
        }
        if (state.militia){
            app.outputs.militia.textContent = `Vous avez  une micile niveau ${state.militia.level}, elle éxecute ${state.militia.kill} enemis par seconde`
            app.buttons.militia.innerHTML = `${state.militia.level > 0?'Améliorer la milice ':`Créer une milice pour ${state.militia.cost}`} pour ${state.militia.upgrade.cost.toFixed(2)} <img src="./lumber.png">`;
        }
        if(state.Sawmill.level >= 4 && state.silo.level >= 3 ){
          
            app.buttons.defense.classList.add('available')
            app.buttons.militia.classList.add('available')
            app.buttons.militia.classList.remove('soon')
            app.outputs.enemies.classList.remove('soon')
            app.outputs.wave.classList.remove('soon')
            app.outputs.defense.classList.remove('soon')
            app.outputs.militia.classList.remove('soon')
            app.outputs.wave.textContent = `Vague n°${state.wave.wave}`
            app.outputs.enemies.textContent = `${state.wave.enemies} ennemis`
                
        }
    },

   /* StartWave :async () => {
        console.log('lastartwave')
        const state = await fetch(app.baseUrl + ('/letsgetenemies'), {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;

           
    }, */
    handleSawmillClick: async (e) => {
        const state = await fetch('http://localhost:8888/sawmill/upgrade', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;
        if(state.Sawmill.level === 4 && state.silo.level === 3)
        { 
            console.log(app.timing);
            if(!app.timing){
        app.timing = setInterval(app.updateWaveState, 10000);
        } }

        app.updateUI(state);
    },
    handleMiliceClick: async () => {
        const state = await fetch('http://localhost:8888/milice/upgrade', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;

        app.updateUI(state);
    },
    handleSiloClick: async () => {
        const state = await fetch(app.baseUrl + '/silo/upgrade', {
            credentials: 'include'
        }).then(response => response.json());
        app.gameState = state;
        if(state.Sawmill.level === 4 && state.silo.level === 3)
        { 
            console.log(app.timing);
            if(!app.timing){
        app.timing = setInterval(app.updateWaveState, 10000);
        } }
        app.updateUI(state);
    },
    levelUp: (state) => {
        state.wave.level++;
        state.wave.wave = 1;
        state.wave.enemies += (1 * state.wave.level);
        app.compteur = 0 ;
        app.gameState = state;
        app.updateUI(state);
    },
    updateGameState: () => {
        (t=>{const a=Math.round(Date.now()/1e3);
            if (t.wave){t.hp -= ((t.wave.enemies * ((t.Sawmill.level * t.silo.level) / 75)) /2) ; if (t.militia){t.wave.enemies -= t.militia.kill} if (t.wave.enemies <=0) {
                t.wave.enemies = 0;
            }};
           
            s=a-t.lastUpdate;
            return t.lastUpdate=a,t.stock+=t.Sawmill.yield*s,t.stock=Math.min(t.silo.capacity,t.stock),t,t.hp})(app.gameState);
        
        app.updateUI(app.gameState);
    }, 
    updateWaveState : async () => {
        const state = await fetch ('http://localhost:8888/letgetenemies', {
            credentials : 'include'
        }).then(response => response.json());
        app.gameState = state;
        app.updateUI(state);
         
    }
    
}

document.addEventListener('DOMContentLoaded', app.init);