var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    
    if(Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY) >= 150) {
        if(harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            if(Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, 
                {memory: {role: 'harvester'}}) == -6){
                console.log('Not enough energy for spawn!')    
            }        
        }
        else{
            if(upgraders.length < 1) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, 
                    {memory: {role: 'upgrader'}});        
            }
            
            if(builders.length < 1) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName, 
                    {memory: {role: 'builder'}});        
            }
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    // Automatic Road Construction Site Spawn
    for (var k in Game.spawns){
        var sources = Game.spawns[k].room.find(FIND_SOURCES);
        for (var j = 0; j < sources.length; j++)
        {
            var way = Game.spawns[k].pos.findPathTo(sources[j].pos);
            for (var i = 0; i < way.length; i++) 
            {
                Game.spawns[k].room.createConstructionSite(way[i].x,way[i].y, STRUCTURE_ROAD);
            }
        }
        var way = Game.spawns[k].pos.findPathTo(Game.spawns[k].room.controller);
        for (var i = 0; i < way.length; i++) 
        {
            Game.spawns[k].room.createConstructionSite(way[i].x,way[i].y, STRUCTURE_ROAD);
        }
    }
    

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}