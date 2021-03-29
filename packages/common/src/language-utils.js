const UNICODE_MARK_CATEGORY = /\p{M}/gu;

const nfkc = s => s.normalize('NFKC');

const nfd = s => s.normalize('NFD');

const stripMarks = s => {
  /*
  https://unicode.org/reports/tr18/#General_Category_Property
  */
  const cps = nfd(s);
  return nfkc(cps.replace(UNICODE_MARK_CATEGORY, ''));
};

const normalizeString = s => {
  /*
    Strip marks and return the case-folded representation of string
    */
  return stripMarks(s).toLowerCase();
};

export default normalizeString;
