export default class AnalysisReport {
  constructor(featureModel) {
    this.results = new Map();
    this.featureModel = featureModel;
  }

  addAnalysis(filePath, result) {
    this.results.set(filePath, result);
  }

  short() {
    const ret = {feature: {}, data: {}};

    this.results.forEach((value) => {
      for (const featureName in value.feature) {
        if (!ret.feature.hasOwnProperty(featureName)) {
          ret.feature[featureName] = 0;
        }
        ret.feature[featureName] += value.feature[featureName];
      }

      for (const dataName in value.data) {
        if (!ret.data.hasOwnProperty(dataName)) {
          ret.data[dataName] = 0;
        }
        ret.data[dataName] += value.data[dataName];
      }
    });

    return ret;
  }

  long() {
    const ret = {};

    this.results.forEach((value, key) => {
      ret[key] = value;
    });

    return ret;
  }

  filesByFeature(aFeature) {
    const ret = [];

    this.results.forEach((value, key) => {
      for (const featureName in value.feature) {
        if (featureName == aFeature) {
          ret.push(key);
        }
      }
    });

    return ret;
  }

  filesByFeatureLong(aFeature, byCount) {
    const ret = [];

    this.results.forEach((value, key) => {
      for (const featureName in value.feature) {
        if (featureName == aFeature) {
          ret.push({path: key, count: value.feature[featureName]});
        }
      }
    });

    if (byCount) {
      ret.sort(sortByCount);
    }

    return ret;
  }

  featuresByFile(path, byCount) {
    const ret = [];
    const aux = this.results.get(path).feature;

    for (const featureName in aux) {
      ret.push({
        featureName: featureName,
        count: aux[featureName]
      });
    }

    if (byCount) {
      ret.sort(sortByCount);
    }

    return ret;
  }

  filesByData(aProprety) {
    const ret = [];

    this.results.forEach((value, key) => {
      for (const propertyname in value.data) {
        if (propertyname == aProprety) {
          ret.push(key);
        }
      }
    });

    return ret;
  }

  checkAnnotatedFeaturesConsistency() {
    const found = Object.keys(this.short().feature);
    const expected = this.featureModel.featureList
      .map(featureName => this.featureModel.get(featureName))
      .filter(feature => !feature.abstract)
      .map(feature => feature.name);
    const expectedWithoutChildren = this.featureModel.featureList
      .map(featureName => this.featureModel.get(featureName))
      .filter(feature => !feature.abstract)
      .filter(feature => feature.features.length == 0)
      .map(feature => feature.name);

    const res = {
      surplus: {
        desc: 'features found in code but not in feature model',
        values: found.filter(f => expected.indexOf(f) == -1)
      },
      missing: {
        desc: 'child features found in feature model but not in code',
        values: expectedWithoutChildren.filter(f => found.indexOf(f) == -1)
      }
    };

    // features found in code but not in feature model are errors
    res.surplus.count = res.surplus.values.length;

    // feature in feature model not found are warnings
    res.missing.count = res.missing.values.length;

    return res;
  }

  checkAnnotatedDataConsistency(productData) {
    const found = Object.keys(this.short().data);
    const expected = propertyNames(productData.data);

    const res = {
      surplus: found.filter(f => expected.indexOf(f) == -1),
      missing: expected.filter(f => found.indexOf(f) == -1)
    };

    // data parameters found in code but not in product spec are errors
    res.errors = res.surplus.length;

    //data parameters in product spec but not in code are warnings
    res.warnings = res.missing.length;

    return res;
  }

  listFeatures(byCount) {
    const ret = [];
    const aux = this.short().feature;

    for (const featureName in aux) {
      ret.push({
        feature: featureName,
        count: aux[featureName],
        files: this.filesByFeatureLong(featureName, byCount)
      });
    }

    if (byCount) {
      ret.sort(sortByCount);
    }

    return ret;
  }

  listFiles(byCount) {
    const ret = [];
    const aux = this.long();
    let element;

    for (const filePath in aux) {
      element = {
        file: filePath,
        count: Object.keys(aux[filePath].feature).length,
        features: []
      };
      element.features.push({feature: 'aFeature', count: 2});
      ret.push(element);
    }

    if (byCount) {
      ret.sort(sortByCount);
    }

    return ret;
  }
}

const sortByCount = (a, b) => {
  if (a.count > b.count)
    return -1;
  if (a.count < b.count)
    return 1;
  return 0;
};

function propertyNames(obj, array, stack) {
  if (!obj) {
    return [];
  }

  if (!array) {
    array = [];
  }

  Object.keys(obj).forEach(property => {
    if (typeof obj[property] == 'object') {
      propertyNames(
        obj[property],
        array,
        stack ? stack + '.' + property
          : property
      );
    } else {
      array.push(
        stack ? stack + '.' + property
          : property
      );
    }
  });

  return array;
}
