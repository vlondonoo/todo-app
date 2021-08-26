import assert from 'assert';
import {TemplateEngine} from '../src/index';
import {getTestFileContent as f} from './test-utils';

suite('TemplateEngine process feature');

test('create processor', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor();

  assert.strictEqual(p.process('asdf'), 'asdf');
});

test('process static templates', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor();

  assert.strictEqual(p.process('asdf'), 'asdf');
  assert.strictEqual(p.process('<p>'), '<p>');
  assert.strictEqual(
    p.process('function(){\nasdf\n}'),
    'function(){\nasdf\n}'
  );
});

test('process binary file', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor();

  assert.strictEqual(
    p.process(f('template-engine/binary.png')),
    f('template-engine/binary.png')
  );
});

test('process static file templates', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor();

  assert.strictEqual(
    p.process(f('template-engine/static1.txt')),
    f('template-engine/static1.txt')
  );
});

test('process simple conditional true', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({greet: true}, {});

  assert.strictEqual(
    p.process(f('template-engine/simple-conditional.js')),
    f('template-engine/simple-conditional-true.js')
  );
});

test('process simple conditional false', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({greet: false}, {});


  assert.strictEqual(
    p.process(f('template-engine/simple-conditional.js')),
    f('template-engine/simple-conditional-false.js')
  );
});

test('process multiline simple conditional true', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({greet: true}, {});

  assert.strictEqual(
    p.process(f('template-engine/multiline-simple-conditional.js')),
    f('template-engine/simple-conditional-true.js')
  );
});

test('process inline simple conditional true', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({greet: true}, {});

  assert.strictEqual(
    p.process(f('template-engine/inline-conditional.js')),
    f('template-engine/inline-conditional-true.js')
  );
});

test('process inline simple conditional false', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({greet: false}, {});

  assert.strictEqual(
    p.process(f('template-engine/inline-conditional.js')),
    f('template-engine/inline-conditional-false.js')
  );
});

test('process bower.json to set the name', () => {
  const te = new TemplateEngine();
  te.addDelimiter('json', '/*%', '%*/');
  const p = te.createProcessor({}, {title: 'calculator'});

  assert.strictEqual(
    p.process(f('template-engine/bower.json')),
    f('template-engine/bower-calculator.json')
  );
});

test('process testing normalizer', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor();

  assert.strictEqual(p.process('/*%= normalize("asdf") %*/'), 'asdf');
  assert.strictEqual(p.process('/*%= normalize("asdf asdf") %*/'), 'asdfAsdf');
  assert.strictEqual(p.process('/*%= normalize("España") %*/'), 'espana');
  assert.strictEqual(p.process('/*%= normalize("María") %*/'), 'maria');
  assert.strictEqual(p.process('/*%= normalize("María _  José") %*/'), 'mariaJose');
  assert.strictEqual(p.process('/*%= normalize("España", true) %*/'), 'Espana');

});

suite('TemplateEngine process custom delimiters');

test('process text with custom delimiters', () => {
  const te = new TemplateEngine({
    startDelimiter: '<$',
    endDelimiter: '$$$'
  });
  const p = te.createProcessor({greet: true}, {});

  assert.strictEqual(
    p.process(f('template-engine/custom-delimiters.js')),
    f('template-engine/inline-conditional-true.js')
  );
});

test('process different text with different custom delimiters', () => {
  const te = new TemplateEngine();
  te.addDelimiter('html', '<!--%', '-->');
  te.addDelimiter('py', '#%', '%#');
  const askGreetProc = te.createProcessor({ask: true, greet: true});
  const notAskByeProc = te.createProcessor({ask: false, bye: true});
  const nothingPro = te.createProcessor();


  assert.strictEqual(
    askGreetProc.process(f('template-engine/custom-delimiter.py'), 'py'),
    f('template-engine/custom-delimiter-ask.py')
  );
  assert.strictEqual(
    notAskByeProc.process(f('template-engine/custom-delimiter.py'), 'py'),
    f('template-engine/custom-delimiter-not-ask.py')
  );

  assert.strictEqual(
    askGreetProc.process(
      f('template-engine/custom-delimiter.html'),
      'html'
    ),
    f('template-engine/custom-delimiter-greet.html')
  );
  assert.strictEqual(
    notAskByeProc.process(
      f('template-engine/custom-delimiter.html'),
      'html'
    ),
    f('template-engine/custom-delimiter-bye.html')
  );
  assert.strictEqual(
    nothingPro.process(f('template-engine/custom-delimiter.html'), 'html'),
    f('template-engine/custom-delimiter-nothing.html')
  );

  assert.strictEqual(
    askGreetProc.process(f('template-engine/simple-conditional.js')),
    f('template-engine/simple-conditional-true.js')
  );
  assert.strictEqual(
    notAskByeProc.process(f('template-engine/simple-conditional.js')),
    f('template-engine/simple-conditional-false.js')
  );
});

suite('TemplateEngine process data');

test('simple data', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({}, {property: 'asdf'});

  assert.strictEqual(
    p.process('/*%= data.property %*/'),
    'asdf'
  );
});

test('simple data escaping first character of end delimiter', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({}, {property: 'asdf'});

  assert.strictEqual(
    p.process('/*%= data.property + "\\%" %*/'),
    'asdf%'
  );
});

test('nested data', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({}, {property: {one: 'one', two: 'two'}});

  assert.strictEqual(
    p.process('/*%= data.property.one %*/, /*%= data.property.two %*/'),
    'one, two'
  );
});

test('for loop', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({}, {
    property: [{
      name: 'one', value: 1
    }, {
      name: 'two', value: 2
    }
    ]
  });

  assert.strictEqual(
    p.process(f('template-engine/for-loop.js')),
    'one: 1,\ntwo: 2\n'
  );
});

test('for loop escaping first character of end delimiter', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({}, {
    property: [{
      name: 'one', value: 1
    }, {
      name: 'two', value: 2
    }
    ]
  });

  assert.strictEqual(
    p.process(f('template-engine/for-loop-escaped.js')),
    'one%: 1,\ntwo%: 2\n'
  );
});

test('json with escaped values', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({}, {});

  assert.strictEqual(
    p.process(f('template-engine/menu.json')),
    f('template-engine/menu.json')
  );
});

test('md file with some data', () => {
  const te = new TemplateEngine();
  const p = te.createProcessor({}, {
    name: 'product'
  });

  assert.strictEqual(
    p.process(f('template-engine/README.md')),
    f('template-engine/README-product.md')
  );
});

test('using first char of final delimiter', () => {
  const te = new TemplateEngine({
    startDelimiter: '###<',
    endDelimiter: '>###'
  });
  const p = te.createProcessor();

  assert.strictEqual(
    p.process('###< if (6 > 5) { >###asdf###< } >###'),
    'asdf'
  );
});
