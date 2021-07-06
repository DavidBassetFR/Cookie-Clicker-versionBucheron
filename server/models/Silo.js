const SiloTemplate = {
    level: 0,
    capacity: 30,
    cost: 15
};

const Silo = {
    level: 0,
    capacity: 30,
    cost: 15,
    upgrade: {
        CAPACITY_FACTOR: 1.3,
        COST_FACTOR: 1.3
    },
    generate: (level) => {
        
        Silo.capacity = Silo.capacity * Silo.upgrade.CAPACITY_FACTOR;
        Silo.cost = Silo.upgrade.COST_FACTOR * Silo.cost;
        Silo.level ++;
    }
};

module.exports = Silo;