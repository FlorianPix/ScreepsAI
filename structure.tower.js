var structureTower = {

    /** @param {Structure} tower **/
    run: function(tower) {
        var target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.hits < 10000
        });
        tower.repair(target);
        
        var target = tower.pos.findClosestByRange(FIND_CREEPS, {
            filter: (s) => s.hits < s.hitsMax
        });
        tower.heal(target);
	}
};

module.exports = structureTower;