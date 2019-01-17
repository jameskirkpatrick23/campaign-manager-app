export default function generator___fantasy___ogres() {
  const nm1 = [
    'B',
    'Bl',
    'Br',
    'D',
    'Dr',
    'G',
    'Gl',
    'Gr',
    'K',
    'Kl',
    'Kr',
    'M',
    'N',
    'T',
    'Tr',
    'V',
    'Vr',
    'W',
    'X',
    'Y',
    'Z',
    '',
    '',
    '',
    ''
  ];
  const nm2 = ['e', 'i', 'u', 'o', 'a'];
  const nm3 = [
    'b',
    'd',
    'g',
    'k',
    'l',
    'm',
    'n',
    'r',
    's',
    't',
    'w',
    'x',
    'z',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ];
  const nm4 = [
    'g',
    'k',
    'rug',
    'rog',
    'rag',
    'ruk',
    'rok',
    'kag',
    'rth',
    'rub',
    'rob',
    'rig',
    'kohr',
    'kuhr',
    'kor',
    'kur',
    'ret',
    'rut',
    'rot',
    'kug',
    'kog',
    'kig',
    'keg',
    'reg',
    'rek',
    'rg',
    'rk',
    'zar',
    'zug',
    'zor',
    'zag',
    'zig',
    'zir',
    'zur',
    'nk',
    'gut',
    'grut',
    'grot',
    'gruk',
    'grok',
    'rok',
    'ruk',
    'rag',
    'gark',
    'gork',
    'gurk',
    'kur',
    'kurk',
    'kurg',
    'kor',
    'kork',
    'korg',
    'zog',
    'zug',
    'zig',
    'zrog',
    'zrug'
  ];

  const i = Math.floor(Math.random() * 10);
  let names = 0;
  let rnd = Math.floor(Math.random() * nm1.length);
  let rnd2 = Math.floor(Math.random() * nm2.length);
  let rnd3 = 0;
  let rnd4 = Math.floor(Math.random() * nm4.length);
  let rnd5 = 0;
  if (i < 5) {
    names = nm1[rnd] + nm2[rnd2] + nm4[rnd4];
  } else {
    rnd3 = Math.floor(Math.random() * nm3.length);
    rnd5 = Math.floor(Math.random() * nm2.length);
    names = nm1[rnd] + nm2[rnd2] + nm3[rnd3] + nm2[rnd5] + nm4[rnd4];
  }
  return names;
}
