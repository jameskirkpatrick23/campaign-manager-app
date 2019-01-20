import _ from 'lodash';
import aasimarGenerator from './races/aasimars';
import angelGenerator from './races/angels';
import centaurGenerator from './races/centaurs';
import demonGenerator from './races/demons';
import dragonbornGenerator from './races/dragonborns';
import dragonGenerator from './races/dragons';
import generateDragonDescription from '../descriptions/dragons';
import drowGenerator from './races/drows';
import dwarfGenerator from './races/dwarfs';
import elfGenerator from './races/elfs';
import giantGenerator from './races/giants';
import githGenerator from './races/githzerais';
import gnollGenerator from './races/gnolls';
import gnomeGenerator from './races/gnomes';
import goblinGenerator from './races/goblins';
import goliathGenerator from './races/goliaths';
import halfelfGenerator from './races/half_elfs';
import halforcGenerator from './races/half_orcs';
import halflingGenerator from './races/halflings';
import humanGenerator from './races/humans';
import koboldGenerator from './races/kobolds';
import lamiaGenerator from './races/lamias';
import lichGenerator from './races/lichs';
import minotaurGenerator from './races/minotaurs';
import nagaGenerator from './races/nagas';
import ogreGenerator from './races/ogres';
import orcGenerator from './races/orcs';
import shifterGenerator from './races/shifters';
import tabaxiGenerator from './races/tabaxis';
import tieflingGenerator from './races/tieflings';
import trollsGenerator from './races/trolls';
import vampireGenerator from './races/vampires';
import werewolfGenerator from './races/werewolfs';
import backstoryGenerator from './backstorys';
import physicalDescriptionGenerator from './characters';

const canGenerateRaceName = function(raceName) {
  const availableGenerators = {
    aasimarGenerator,
    angelGenerator,
    centaurGenerator,
    demonGenerator,
    dragonbornGenerator,
    dragonGenerator,
    drowGenerator,
    dwarfGenerator,
    elfGenerator,
    giantGenerator,
    githGenerator,
    gnollGenerator,
    gnomeGenerator,
    goblinGenerator,
    goliathGenerator,
    halfelfGenerator,
    halforcGenerator,
    halflingGenerator,
    humanGenerator,
    koboldGenerator,
    lamiaGenerator,
    lichGenerator,
    minotaurGenerator,
    nagaGenerator,
    ogreGenerator,
    orcGenerator,
    shifterGenerator,
    tabaxiGenerator,
    tieflingGenerator,
    trollsGenerator,
    vampireGenerator,
    werewolfGenerator
  };
  return availableGenerators[`${raceName}Generator`];
};

const createRaceName = function(raceName, gender) {
  const genderVariable = gender.toLowerCase() === 'male' ? 0 : 1;
  const availableGenerators = {
    aasimarGenerator,
    angelGenerator,
    centaurGenerator,
    demonGenerator,
    dragonbornGenerator,
    dragonGenerator,
    drowGenerator,
    dwarfGenerator,
    elfGenerator,
    giantGenerator,
    githGenerator,
    gnollGenerator,
    gnomeGenerator,
    goblinGenerator,
    goliathGenerator,
    halfelfGenerator,
    halforcGenerator,
    halflingGenerator,
    humanGenerator,
    koboldGenerator,
    lamiaGenerator,
    lichGenerator,
    minotaurGenerator,
    nagaGenerator,
    ogreGenerator,
    orcGenerator,
    shifterGenerator,
    tabaxiGenerator,
    tieflingGenerator,
    trollsGenerator,
    vampireGenerator,
    werewolfGenerator
  };
  let name = _.attempt(
    availableGenerators[`${raceName}Generator`],
    genderVariable
  );
  if (_.isError(name)) {
    name = '';
  }
  return _.startCase(name);
};

const createNpcBackstory = function(gender) {
  const genderVariable = gender.toLowerCase() === 'male' ? 0 : 1;
  return backstoryGenerator(genderVariable);
};

const createNpcDescription = function(raceName, gender) {
  const genderVariable = gender.toLowerCase() === 'male' ? 0 : 1;
  if (raceName.toLowerCase() === 'dragon') {
    return generateDragonDescription();
  }
  return physicalDescriptionGenerator(genderVariable);
};

export {
  createRaceName,
  canGenerateRaceName,
  createNpcDescription,
  createNpcBackstory
};
