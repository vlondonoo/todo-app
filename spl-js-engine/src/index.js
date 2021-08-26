#!/usr/bin/env node

export DerivationEngine from './derivation-engine';
export FeatureModel from './feature-model/feature-model';
export TemplateEngine from './template-engine/template-engine';

export {readJsonFromFile, readFile} from './file-utils';

import {cli} from './cli';

if (require.main === module) cli();
