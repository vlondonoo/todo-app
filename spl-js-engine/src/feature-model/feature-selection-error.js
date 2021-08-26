export default class FeatureSelectionError {
  constructor(message, featureSelection, previousException) {
    this.message = message;
    if (featureSelection) {
      this.featureSelection = featureSelection;
    }
    if (previousException) {
      this.featureName = previousException.featureName;
      this.featureType = previousException.featureType;
      this.errorType = previousException.errorType;
    }
  }

  toString() {
    return this.message;
  }
}
