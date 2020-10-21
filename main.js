var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleScout = require('role.scout');
var roleSoldier = require('role.soldier');
var structureTower = require('structure.tower');

const number_of_harvesters = 3;
const number_of_upgraders = 2;
const number_of_builders = 2;
const number_of_scouts = 0;
const number_of_soldiers = 0;

const build_cost_move = 50;
const build_cost_work = 100;
const build_cost_carry = 50;
const build_cost_attack = 80;
const build_cost_ranged_attack = 150;
const build_cost_heal = 250;
const build_cost_claim = 600;
const build_cost_tough = 10;

module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var cur_energy = Game.spawns['Spawn1'].room.energyAvailable;
    
    if(cur_energy >= 300) {
        if(harvesters.length < number_of_harvesters) {
            spawnMyCreep(cur_energy, 'harvester', 1, 2, 1, 0, 0, 0, 0, 0);
        }
        else{
            if(upgraders.length < number_of_upgraders) {
               spawnMyCreep(cur_energy, 'upgrader', 1, 2, 1, 0, 0, 0, 0, 0)        
            }
            
            if(builders.length < number_of_builders) {
                spawnMyCreep(cur_energy, 'builder', 2, 2, 1, 0, 0, 0, 0, 0)      
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


function spawnMyCreep(available_energy, role_name, prio_move, prio_work, prio_carry, prio_attack, prio_ranged_attack, prio_heal, prio_claim, prio_tough) {
    var newName = role_name + Game.time;
    var min_cost;
    if (prio_tough > 0) {
        min_cost = build_cost_tough;
    } else {
        if (prio_move > 0) {
            min_cost = build_cost_move;
        }
    }
    console.log('Spawning new creep: ' + newName + ',Available energy: ' + available_energy);
    var body_parts = [];
    while(available_energy > min_cost){
        for(var i = prio_move; i > 0; i--){
            if (available_energy >= build_cost_move) {
                body_parts.push(MOVE)
                available_energy -= build_cost_move;
            }
        }
        for(var i = prio_work; i > 0; i--){
            if (available_energy >= build_cost_work) {
                body_parts.push(WORK)
                available_energy -= build_cost_work;
            }
        }
        for(var i = prio_carry; i > 0; i--){
            if (available_energy >= build_cost_carry) {
                body_parts.push(CARRY)
                available_energy -= build_cost_carry;
            }
        }
        /*
        for(var i = prio_attack; i > 0; i--){
            if (available_energy >= build_cost_attack) {
                body_parts.push[ATTACK]
                available_energy -= build_cost_attack;
            }
        }
        for(var i = prio_ranged_attack; i > 0; i--){
            if (available_energy >= build_cost_ranged_attack) {
                body_parts.push[RANGED_ATTACK]
                available_energy -= build_cost_ranged_attack;
            }
        }
        for(var i = prio_heal; i > 0; i--){
            if (available_energy >= build_cost_heal) {
                body_parts.push[HEAL]
                available_energy -= build_cost_heal;
            }
        }
        for(var i = prio_claim; i > 0; i--){
            if (available_energy >= build_cost_claim) {
                body_parts.push[CLAIM]
                available_energy -= build_cost_claim;
            }
        }
        for(var i = prio_tough; i > 0; i--){
            if (available_energy >= build_cost_tough) {
                body_parts.push[TOUGH]
                available_energy -= build_cost_tough;
            }
        }
        */
    }
    if(Game.spawns['Spawn1'].spawnCreep(body_parts, newName, 
        {memory: {role: role_name}}) == -6){
        console.log('Not enough energy for spawn!')
    }
}