import Engine from './engine.js';

export default class Analyser extends Engine {
  constructor(delimiters = {}) {
    super(delimiters);
  }

  analyse(str, ext) {
    const delimiter = this.getDelimiter(ext);
    const result = {feature: {}, data: {}};
    // let cursor = 0;
    let match, featureMatch, featureAux, dataMatch;

    while ((match = delimiter.regular.exec(str)) !== null) {
      while ((featureMatch =
        delimiter.feature.exec(match.slice(1).join(''))) !== null) {

        featureAux = featureMatch[0].replace('feature.', '');
        if (!result.feature.hasOwnProperty(featureAux)) {
          result.feature[featureAux] = 0;
        }
        result.feature[featureAux]++;
      }
      while ((dataMatch =
        delimiter.data.exec(match.slice(1).join(''))) !== null) {

        featureAux = dataMatch[0].replace('data.', '');
        if (!result.data.hasOwnProperty(featureAux)) {
          result.data[featureAux] = 0;
        }
        result.data[featureAux]++;
      }
      // cursor = match.index + match[0].length;
    }

    return result;
  }
}
