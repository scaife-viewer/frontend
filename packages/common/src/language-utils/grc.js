const VARIA = '\u0300';
const OXIA = '\u0301';
const PERISPOMENI = '\u0342';

const PSILI = '\u0313';
const DASIA = '\u0314';

const ACCENTS = [VARIA, OXIA, PERISPOMENI];
const BREATHING = [PSILI, DASIA];

const ACCENTS_AND_BREATHING = [...ACCENTS, ...BREATHING];

const nfc = s => s.normalize('NFC');

const nfd = s => s.normalize('NFD');

const stripAccents = s => {
  const cps = nfd(s);
  const allowed = [];
  for (let index = 0; index < cps.length; index += 1) {
    const cp = cps[index];
    if (ACCENTS_AND_BREATHING.indexOf(cp) === -1) {
      allowed.push(cp);
    }
  }
  return nfc(allowed.join(''));
};

const normalizeGreek = s => {
  /*
    Strip accent and breathing marks and return case-folded
    representation of string
    */
  return stripAccents(s).toLowerCase();
};

export default normalizeGreek;
