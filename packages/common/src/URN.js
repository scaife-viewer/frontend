export default class URN {
  constructor(urn) {
    this.absolute = urn;
    this.delimiter = ':';
    this.scheme = null;
    this.nid = null;
    this.nss = null;
    this.textGroup = null;
    this.work = null;
    this.versionPart = null;
    this.workPart = null;
    this.reference = null;
    this.version = null;
    this.destructureUrn();
  }

  // TODO: Unify API with `upTo` vs params
  destructureUrn() {
    const split = this.absolute.split(this.delimiter);
    [this.scheme, this.nid, this.nss, this.work, this.reference] = split;
    this.version = `${this.urnPrefix}:${this.work}:`;
    const versionParts = this.version.split(':').slice(-2)[0].split('.');
    [this.textGroup, this.workPart, this.versionPart] = versionParts;
  }

  toString() {
    return this.absolute;
  }

  get urnPrefix() {
    return `${this.scheme}:${this.nid}:${this.nss}`;
  }

  get lcp() {
    return this.reference
      ? this.reference
          .split('-')[0]
          .split('.')
          .slice(-1)[0]
      : null;
  }

  upTo(segment) {
    // NOTE: Backported from https://github.com/scaife-viewer/scaife-viewer/blob/59fbb4eb6bd886285eb27bf95c5ea0ce578f2b3e/static/src/js/urn.js#L32C1-L49C4
    const segments = [this.urnPrefix, ':'];
    if (segment === 'textGroup') {
      segments.push(this.textGroup, ':');
      return segments.join('');
    }
    if (segment === 'work') {
      segments.push(this.textGroup, '.');
      segments.push(this.workPart, ':');
      return segments.join('');
    }
    if (segment === 'version') {
      return this.version
    }
    if (segment === 'reference')  {
      return this.absolute;
    }
    return null;
  }

}
