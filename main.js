var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var structureTower = require('structure.tower');
var number_of_harvesters = 3;
var number_of_upgraders = 2;
var number_of_builders = 2;
var number_of_scouts = 2;

module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var cur_energy = Game.spawns['Spawn1'].room.energyAvailable;
    var body_parts_harvester = [WORK, CARRY, MOVE, MOVE];
    var body_parts_builder =  [WORK, CARRY, MOVE, MOVE];
    var body_parts_upgrader =  [WORK, CARRY, MOVE, MOVE];
    var body_parts_scout = [CLAIM, MOVE, MOVE]
    if(cur_energy >= 500){
        body_parts_harvester = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        body_parts_builder =  [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        body_parts_upgrader =  [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    } else {
        if(cur_energy >= 750){
            body_parts_harvester = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            body_parts_builder =  [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            body_parts_upgrader =  [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
    }
    
    if(Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY) >= 250) {
        if(harvesters.length < number_of_harvesters) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            if(Game.spawns['Spawn1'].spawnCreep(body_parts_harvester, newName, 
                {memory: {role: 'harvester'}}) == -6){
                console.log('Not enough energy for spawn!')    
            }        
        }
        else{
            if(upgraders.length < number_of_upgraders) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(body_parts_upgrader, newName, 
                    {memory: {role: 'upgrader'}});        
            }
            
            if(builders.length < number_of_builders) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(body_parts_builder, newName, 
                    {memory: {role: 'builder'}});        
            }
            
            if(builders.length < number_of_scouts) {
                var newName = 'Scouts' + Game.time;
                console.log('Spawning new scout: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(body_parts_scout, newName, 
                    {memory: {role: 'scout'}});        
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
            var way = Game.spawns[k].pos.findPathTo(sources[j].pos, {ignoreCreeps:true});
            for (var i = 1; i < way.length - 1; i++) 
            {
                Game.spawns[k].room.createConstructionSite(way[i].x,way[i].y, STRUCTURE_ROAD);
            }
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
    for (var name in Game.structures){
        var structure = Game.structures[name];
        if(structure.structureType == STRUCTURE_TOWER){
            structureTower.run(structure);    
        }
    }
}