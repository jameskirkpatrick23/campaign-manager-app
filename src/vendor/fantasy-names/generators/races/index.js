import aasimarGenerator from './aasimars';
import angelGenerator from './angels';
import centaurGenerator from './centaurs';
import demonGenerator from './demons';
import dragonbornGenerator from './dragonborns';
import dragonGenerator from './dragons';
import drowGenerator from './drows';
import dwarfGenerator from './dwarfs';
import elfGenerator from './elfs';
import giantGenerator from './giants';
import githGenerator from './githzerais';
import gnollGenerator from './gnolls';
import gnomeGenerator from './gnomes';
import goblinGenerator from './goblins';
import goliathGenerator from './goliaths';
import half_elfGenerator from './half_elfs';
import half_orcGenerator from './half_orcs';
import halflingGenerator from './halflings';
import humanGenerator from './humans';
import koboldGenerator from './kobolds';
import lamiaGenerator from './lamias';
import lichGenerator from './lichs';
import minotaurGenerator from './minotaurs';
import nagaGenerator from './nagas';
import ogreGenerator from './ogres';
import orcGenerator from './orcs';
import shifterGenerator from './shifters';
import tabaxiGenerator from './tabaxis';
import tieflingGenerator from './tieflings';
import trollsGenerator from './trolls';
import vampireGenerator from './vampires';
import werewolfGenerator from './werewolfs';

export default function(raceName, gender) {
  const genderVariable = gender === 'male' ? 1 : 0;
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
    half_elfGenerator,
    half_orcGenerator,
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
  return availableGenerators[`${raceName}Generator`](genderVariable);
}
