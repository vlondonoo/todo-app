import assert from 'assert';
import {TemplateEngine} from '../src/index';

suite('TemplateEngine analysis feature');

test('create analyser', () => {
  const te = new TemplateEngine();
  const a = te.createAnalyser();

  assert.deepEqual(a.analyse('asdf'), {feature: {}, data: {}});
});

test('create analyser and analyse simple code with a feature', () => {
  const te = new TemplateEngine();
  const a = te.createAnalyser();

  assert.deepEqual(
    a.analyse('/*% if (feature.aFeature) { %*/ asdf /*% } %*/'),
    {feature: {aFeature: 1}, data: {}}
  );
});

test('create analyser and analyse simple code with 2 features', () => {
  const te = new TemplateEngine();
  const a = te.createAnalyser();

  assert.deepEqual(
    a.analyse('/*% if (feature.aFeature && feature.bFeature) { %*/ ' +
      'asdf /*% } %*/'),
    {feature: {aFeature: 1, bFeature: 1}, data: {}}
  );
});

test('analyse multi features if', () => {
  const te = new TemplateEngine();
  const a = te.createAnalyser();

  assert.deepEqual(
    a.analyse(
      `asdf
            /*% if (feature.aFeature || feature.anotherFeature) { %*/
                whatever
            /*% } else if (feature.aFeature) { %*/
                whatever
            /*% } %*/`
    ),
    {feature: {aFeature: 2, anotherFeature: 1}, data: {}}
  );
});

test('create analyser and analyse simple code with data', () => {
  const te = new TemplateEngine();
  const a = te.createAnalyser();

  assert.deepEqual(
    a.analyse('/*%= data.aValue %*/'),
    {feature: {}, data: {aValue: 1}}
  );
});

test('create analyser and analyse code with features and data', () => {
  const te = new TemplateEngine();
  const a = te.createAnalyser();

  assert.deepEqual(
    a.analyse(
      `asdf
            /*% if (feature.aFeature || feature.anotherFeature) { %*/
              /*%= data.aValue %*/
            /*% } else if (feature.aFeature) { %*/
              /*%= data.aValue %*/
            /*% } %*/`
    ),
    {feature: {aFeature: 2, anotherFeature: 1}, data: {aValue: 2}}
  );
});
