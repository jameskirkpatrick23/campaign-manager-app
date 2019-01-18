export default function generator___pathfinder___aasimars(type) {
  const nm1 = [
    '',
    '',
    '',
    '',
    '',
    'b',
    'c',
    'cr',
    'd',
    'gr',
    'k',
    'kr',
    'l',
    'm',
    'n',
    'p',
    's',
    't',
    'w',
    'z'
  ];
  const nm2 = [
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'y',
    'ai',
    'au',
    'ie',
    'ia',
    'ea'
  ];
  const nm3 = [
    'b',
    'b',
    'd',
    'd',
    'dr',
    'g',
    'g',
    'gr',
    'gn',
    'k',
    'k',
    'kw',
    'kr',
    'l',
    'l',
    'lw',
    'lr',
    'lm',
    'ln',
    'lg',
    'lt',
    'm',
    'm',
    'mr',
    'ml',
    'mw',
    'n',
    'n',
    'nr',
    'nl',
    'ng',
    'nv',
    'nw',
    'r',
    'r',
    'rl',
    'rw',
    'rg',
    'rn',
    't',
    't'
  ];
  const nm4 = ['l', 'm', 'n', 'n', 'n', 'nt', 'r'];
  const nm5 = [
    '',
    '',
    '',
    '',
    'b',
    'br',
    'd',
    'dr',
    'h',
    'l',
    'm',
    'n',
    'p',
    'ph',
    'r',
    'rh',
    'v',
    'vh',
    'w'
  ];
  const nm6 = [
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'a',
    'e',
    'i',
    'o',
    'u',
    'oe',
    'ou',
    'ua',
    'ea',
    'ia'
  ];
  const nm7 = [
    'd',
    'd',
    'dr',
    'dy',
    'gr',
    'j',
    'j',
    'l',
    'l',
    'll',
    'lt',
    'ld',
    'lm',
    'ln',
    'ldr',
    'ls',
    'm',
    'm',
    'mr',
    'mk',
    'ml',
    'n',
    'n',
    'ndr',
    'nd',
    'nk',
    'ng',
    'nd',
    'ny',
    'nm',
    'p',
    'p',
    'pr',
    'r',
    'r',
    'rk',
    'rl',
    's',
    's',
    'v',
    'v',
    'y',
    'y',
    'z',
    'z'
  ];
  const nm8 = ['', '', '', '', '', '', '', '', '', 'h', 'l', 'n', 'r'];
  const nm9 = [
    '',
    '',
    '',
    '',
    'b',
    'br',
    'd',
    'dr',
    'h',
    'k',
    'kr',
    'l',
    'm',
    'n',
    'p',
    'r',
    's',
    't',
    'v',
    'w',
    'z'
  ];
  const nm10 = ['a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'y'];
  const nm11 = [
    'b',
    'd',
    'g',
    'gr',
    'h',
    'k',
    'kr',
    'km',
    'l',
    'll',
    'lr',
    'ls',
    'lg',
    'ldr',
    'lm',
    'lw',
    'm',
    'mr',
    'ml',
    'n',
    'nm',
    'ng',
    'nv',
    'nk',
    'p',
    'pr',
    'r',
    'rl',
    'rg',
    'rv',
    'rw',
    's',
    'v',
    'z'
  ];
  const nm12 = ['', '', '', 'l', 'm', 'n', 'r'];

  const i = Math.floor(Math.random() * 10);
  let rnd = 0;
  let rnd2 = 0;
  let rnd3 = 0;
  let rnd4 = 0;
  let rnd5 = 0;
  let rnd6 = 0;
  let rnd7 = 0;
  let rnd10 = Math.floor(Math.random() * nm9.length);
  let rnd11 = Math.floor(Math.random() * nm10.length);
  let rnd12 = Math.floor(Math.random() * nm12.length);
  let rnd13 = Math.floor(Math.random() * nm11.length);
  let rnd14 = Math.floor(Math.random() * nm10.length);
  let rnd15 = 0;
  let rnd16 = 0;
  let names = 0;
  let nameLast = 0;
  if (i % 2 === 0) {
    rnd15 = Math.floor(Math.random() * nm11.length);
    rnd16 = Math.floor(Math.random() * nm10.length);
    nameLast =
      nm9[rnd10] +
      nm10[rnd11] +
      nm11[rnd13] +
      nm10[rnd14] +
      nm11[rnd15] +
      nm10[rnd16] +
      nm12[rnd12];
  } else {
    nameLast =
      nm9[rnd10] + nm10[rnd11] + nm11[rnd13] + nm10[rnd14] + nm12[rnd12];
  }
  if (type === 1) {
    rnd = Math.floor(Math.random() * nm5.length);
    rnd2 = Math.floor(Math.random() * nm6.length);
    rnd3 = Math.floor(Math.random() * nm7.length);
    rnd4 = Math.floor(Math.random() * nm6.length);
    rnd5 = Math.floor(Math.random() * nm8.length);
    if (i < 6) {
      names =
        nm5[rnd] +
        nm6[rnd2] +
        nm7[rnd3] +
        nm6[rnd4] +
        nm8[rnd5] +
        ' ' +
        nameLast;
    } else {
      rnd6 = Math.floor(Math.random() * nm7.length);
      rnd7 = Math.floor(Math.random() * nm6.length);
      names =
        nm5[rnd] +
        nm6[rnd2] +
        nm7[rnd3] +
        nm6[rnd4] +
        nm7[rnd6] +
        nm6[rnd7] +
        nm8[rnd5] +
        ' ' +
        nameLast;
    }
  } else {
    rnd = Math.floor(Math.random() * nm1.length);
    rnd2 = Math.floor(Math.random() * nm2.length);
    rnd3 = Math.floor(Math.random() * nm3.length);
    rnd4 = Math.floor(Math.random() * nm2.length);
    rnd5 = Math.floor(Math.random() * nm4.length);
    if (i < 7) {
      names =
        nm1[rnd] +
        nm2[rnd2] +
        nm3[rnd3] +
        nm2[rnd4] +
        nm4[rnd5] +
        ' ' +
        nameLast;
    } else {
      rnd6 = Math.floor(Math.random() * nm3.length);
      rnd7 = Math.floor(Math.random() * nm2.length);
      names =
        nm1[rnd] +
        nm2[rnd2] +
        nm3[rnd3] +
        nm2[rnd4] +
        nm3[rnd6] +
        nm2[rnd7] +
        nm4[rnd5] +
        ' ' +
        nameLast;
    }
  }
  return names;
}
