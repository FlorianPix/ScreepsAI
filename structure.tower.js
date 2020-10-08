var structureTower = {

    /** @param {Structure} tower **/
    run: function(tower) {
        var target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax
        });
        tower.repair(target);
	}
};

module.exports = structureTower;