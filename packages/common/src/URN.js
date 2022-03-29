export default class URN {
  constructor(urn) {
    this.absolute = urn;
    this.delimiter = ':';
    this.scheme = null;
    this.nid = null;
    this.nss = null;
    this.textGroup = null;
    this.work = null;
    this.reference = null;
    this.version = null;
    this.destructureUrn();
  }

  // TODO: Unify API with `upTo` vs params
  destructureUrn() {
    const split = this.absolute.split(this.delimiter);
    [this.scheme, this.nid, this.nss, this.work, this.reference] = split;
    this.version = `${this.scheme}:${this.nid}:${this.nss}:${this.work}:`;
    // eslint-disable-next-line prefer-destructuring
    this.textGroup = this.version
      .split('.')[0]
      .split(':')
      .slice(-1)[0];
  }

  toString() {
    return this.absolute;
  }

  get lcp() {
    return this.reference
      ? this.reference
          .split('-')[0]
          .split('.')
          .slice(-1)[0]
      : null;
  }
}
