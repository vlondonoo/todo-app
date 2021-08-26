export default class EvaluationHelper {
  constructor(namesOfSelectedFeatures) {
    this._added = new Set(namesOfSelectedFeatures);
    this._rejected = new Set();
  }

  toString() {
    return [...this._added].map(c => `+${c}`).join(', ') +
      [...this._rejected].map(c => `-${c}`).join(', ');
  }

  isAdded(featureName) {
    return this._added.has(featureName);
  }

  add(featureName) {
    this._added.add(featureName);
  }

  get added() {
    return [...this._added];
  }

  isRejected(featureName) {
    return this._rejected.has(featureName);
  }
}
