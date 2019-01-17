function generator$places$laboratorys() {
  var nm1 = [
    'Lab',
    'Laboratory',
    'Testing Bureau',
    'Research Center',
    'Test Center',
    'Research Lab',
    'Testing Grounds',
    'Defense Lab'
  ];
  var nm2 = [
    'Abused',
    'Abusing',
    'Adjusted',
    'Advanced',
    'Advancing',
    'Altered',
    'Altering',
    'Ambiguous',
    'Analysing',
    'Augmentating',
    'Augmented',
    'Changing',
    'Classified',
    'Customized',
    'Declined',
    'Declining',
    'Defined',
    'Detecting',
    'Deteriorated',
    'Deteriorating',
    'Developed',
    'Developing',
    'Diagnosing',
    'Diminished',
    'Diminishing',
    'Discovered',
    'Discovering',
    'Documented',
    'Dynamic',
    'Enhanced',
    'Enhancing',
    'Enriched',
    'Enriching',
    'Enterprising',
    'Established',
    'Evolution',
    'Evolved',
    'Exploring',
    'Exposed',
    'Exposing',
    'Harmful',
    'Hidden',
    'Improved',
    'Improving',
    'Intervened',
    'Intervening',
    'Introduced',
    'Introducing',
    'Modern',
    'Modified',
    'Mutating',
    'Obscure',
    'Organized',
    'Progressed',
    'Progressing',
    'Progressive',
    'Public',
    'Rare',
    'Recovered',
    'Recovering',
    'Rectified',
    'Rectifying',
    'Reformed',
    'Reforming',
    'Regenerating',
    'Reinforced',
    'Reinforcing',
    'Revised',
    'Revolutionary',
    'Sheltered',
    'Stagnated',
    'Stagnating',
    'Standardized',
    'Tabulated',
    'Transformed',
    'Transforming',
    'Unknown',
    'Unrevealed',
    'Verified'
  ];
  var nm3 = [
    'Adjustment',
    'Advancement',
    'Altercation',
    'Analysis',
    'Augmentation',
    'Classification',
    'Customization',
    'Declinement',
    'Definement',
    'Detection',
    'Deterioration',
    'Development',
    'Diagnosis',
    'Diminishment',
    'Discovery',
    'Documentation',
    'Enhancement',
    'Enrichment',
    'Establishment',
    'Exploration',
    'Exposion',
    'Harming',
    'Improvement',
    'Intervention',
    'Introduction',
    'Modernization',
    'Modification',
    'Mutation',
    'Organizing',
    'Progression',
    'Publication',
    'Recovery',
    'Rectification',
    'Reformation',
    'Regeneration',
    'Reinforcement',
    'Revision',
    'Standardization',
    'Tabulation',
    'Transformation',
    'Revelation',
    'Verification'
  ];
  var nm4 = [
    'Abiogenics',
    'Acarology (Study of Mites & Ticks)',
    'Acrogenics',
    'Aerobiology (Study of Airborne Organisms)',
    'Aerology (Study of the Atmosphere)',
    'Aetiology (Study of Causation)',
    'Agrology (Study of Agricultural Soil)',
    'Algology (Study of Algae)',
    'Allergenics',
    'Allogenics',
    'Anemology (Study of Wind)',
    'Angelology (Study of Angels)',
    'Angiogenics',
    'Angiology (Study of Blood & Lymph Vessels)',
    'Antigenics',
    'Apiology (Study of Bees)',
    'Astrology (Study of Celestial Bodies)',
    'Atherogenics',
    'Audiogenics',
    'Audiology (Study of Hearing)',
    'Autecology (Study of Species)',
    'Autogenics',
    'Balneology (Study of Bathing)',
    'Biogenics',
    'Biology (Study of Living Organisms)',
    'Bryology (Study of Moss)',
    'Cardiogenics',
    'Cardiology (Study of Heart Disease)',
    'Cariogenics',
    'Carpology (Study of Fruit)',
    'Cetology (Study of Whales)',
    'Chromogenics',
    'Climatology (Study of Climate)',
    'Codicology (Study of Manuscripts)',
    'Conchology (Study of Shells)',
    'Cosmogenics',
    'Cosmology (Study of the Universe)',
    'Craniology (Study of Skull Size)',
    'Criminology (Study of Criminals)',
    'Cryobiology (Study of Low Temperatures)',
    'Cryogenics',
    'Cryptogenics',
    'Cryptology (Study of Codes)',
    'Cyanogenics',
    'Cytology (Study of Cells)',
    'Demonology (Study of Demons)',
    'Dendrology (Study of Trees)',
    'Dysgenics',
    'Ecology (Study of Natural Relations)',
    'Ectogenics',
    'Electrology (Study of Electricity)',
    'Embryogenics',
    'Endogenics',
    'Entomology (Study of Insects)',
    'Enzymology (Study of Enzymes)',
    'Epeirogenics',
    'Epigenetic',
    'Epigenics',
    'Ergogenics',
    'Escapology (Study of Escaping)',
    "Eschatology (Study of the World's End)",
    'Ethnology (Study of Ethnicity)',
    'Ethology (Study of Animal Behavior)',
    'Etymology (Study of Words)',
    'Exobiology (Study of Life on Planets)',
    'Florigenics',
    'Futurology (Study of the Future)',
    'Gametogenics',
    'Garbology (Study of Waste)',
    'Gemmology (Study of Gems)',
    'Gemology (Study of Gems)',
    'Geology (Study of Earth)',
    'Gerontology (Study of Ageing)',
    'Glaciology (Study of Glaciers)',
    'Goitrogenics',
    'Graphology (Study of Handwriting)',
    'Hematology (Study of Blood)',
    'Herbology (Study of Herbal Medicine)',
    'Herpetology (Study of Reptiles & Amphibians)',
    'Histology (Study of Tissue)',
    'Horology (Study of Time)',
    'Hydrology (Study of Water)',
    'Hypnology (Study of Sleep)',
    'Iatrogenics',
    'Ichnology (Study of Organic Tracks)',
    'Ichthyology (Study of Fish)',
    'Immunogenics',
    'Immunology (Study of Immunity)',
    'Intragenics',
    'Ionogenics',
    'Iridology (Study of Eyes)',
    'Isogenics',
    'Ketogenics',
    'Kinesiology (Study of Body Movement)',
    'Lexicology (Study of Words)',
    'Lichenology (Study of Lichens)',
    'Limnology (Study of Fresh Water)',
    'Lithology (Study of Rocks)',
    'Lysogenics',
    'Malariology (Study of Malaria)',
    'Mediagenics',
    'Metagenics',
    'Metrology (Study of Measurements)',
    'Mitogenics',
    'Monogenics',
    'Morphogenics',
    'Multigenics',
    'Musicology (Study of Music)',
    'Mutagenics',
    'Mycology (Study of Fungus)',
    'Myogenics',
    'Myology (Study of Muscles)',
    'Myrmecology (Study of Ants)',
    'Mythology (Study of Myths)',
    'Necrology (Study of Death)',
    'Nematology (Study of Worms)',
    'Nephrology (Study of Kidneys)',
    'Neurogenics',
    'Neurology (Study of Nerves)',
    'Nomology (Study of Laws)',
    'Nosology (Study of Diseases)',
    'Numerology (Study of Numbers)',
    'Oceanology (Study of Oceans)',
    'Oecology (Study of Nature Relations)',
    'Oenology (Study of Winemaking)',
    'Oncogenics',
    'Oncology (Study of Cancer)',
    'Onomatology (Study of Names)',
    'Ontogenics',
    'Oology (Study of Bird Eggs)',
    'Ophiology (Study of Snakes)',
    'Organology (Study of Musical Instruments)',
    'Ornithology (Study of Birds)',
    'Orogenics',
    'Orology (Study of Mountains)',
    'Osteogenics',
    'Osteology (Study of Bones)',
    'Otology (Study of the Ear)',
    'Oxygenics',
    'Palynology (Study of Spores & Pollen)',
    'Pathogenics',
    'Pathology (Study of Diseases)',
    'Pedology (Study of Natural Soil)',
    'Penology (Study of Punishment)',
    'Petrology (Study of Rocks)',
    'Phenology (Study of Seasons)',
    'Philology (Study of Language)',
    'Phlebology (Study of Veins)',
    'Phonology (Study of Language)',
    'Photogenics',
    'Phrenology (Study of Skull Sizes)',
    'Phycology (Study of Algae)',
    'Physiology (Study of Functioning of Organisms)',
    'Phytology (Study of Plants)',
    'Polygenics',
    'Pomology (Study of Fruit)',
    'Praxeology (Study of Human Action)',
    'Primatology (Study of Primates)',
    'Psychogenics',
    'Psychology (Study of the Human Mind)',
    'Pteridology (Study of Ferns)',
    'Pyogenics',
    'Pyrogenics',
    'Pyrology (Study of Heat)',
    'Radiogenics',
    'Radiology (Study of X-Rays)',
    'Rheology (Study of Matter Flow)',
    'Rhinology (Study of the Nose)',
    'Saprogenics',
    'Seismology (Study of Earthquakes)',
    'Selenology (Study of the Moon)',
    'Semeiology (Study of Symbols)',
    'Semiology (Study of Signs)',
    'Sitology (Study of Nutrition)',
    'Sociology (Study of Society)',
    'Somatology (Study of the Human Body)',
    'Speleology (Study of Caves)',
    'Sporogenics',
    'Symbology (Study of Symbols)',
    'Synecology (Study of Animal Communities)',
    'Syngenics',
    'Telegenics',
    'Teratogenics',
    'Toxicology (Study of Poisons)',
    'Toxigenics',
    'Transgenics',
    'Tribology (Study of Friction)',
    'Trichology (Study of Hair & Scalp)',
    'Tropology (Study of Language)',
    'Tumorigenics',
    'Ufology (Study of UFOs)',
    'Ulcerogenics',
    'Urbanology (Study of Urban Life)',
    'Venology (Study of Veins)',
    'Victimology (Study of Victims)',
    'Virology (Study of Viruses)',
    'Volcanology (Study of Volcanoes)',
    'Xenogenics',
    'Zoogenics',
    'Zoology (Study of Animals)',
    'Zymogenics',
    'Zymology (Study of Fermentation)'
  ];

  i = Math.floor(Math.random() * 10);
  {
    rnd = Math.floor(Math.random() * nm1.length);
    rnd4 = Math.floor(Math.random() * nm4.length);
    if (i < 5) {
      rnd2 = Math.floor(Math.random() * nm2.length);
      names = nm1[rnd] + ' of ' + nm2[rnd2] + ' ' + nm4[rnd4];
    } else {
      rnd2 = Math.floor(Math.random() * nm3.length);
      names = nm1[rnd] + ' of the ' + nm3[rnd2] + ' of ' + nm4[rnd4];
    }
    return names;
  }
}
