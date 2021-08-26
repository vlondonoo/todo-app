export default class Constraint {
  constructor() {
  }

  static create(featureName) {
    this.id = null;
    return new FeatureConstraint(featureName);
  }

  negated() {
    return new NegatedConstraint(this);
  }

  and(anotherConstraint) {
    return new AndConstraint(this, anotherConstraint);
  }

  or(anotherConstraint) {
    return new OrConstraint(this, anotherConstraint);
  }

  implies(anotherConstraint) {
    return new ImplicationConstraint(this, anotherConstraint);
  }

  iff(anotherConstraint) {
    return new IffConstraint(this, anotherConstraint);
  }

  //////////////////////////////
  // Parsing and Loading JSON //
  //////////////////////////////

  static fromJson(json) {
    if (json == null || (typeof json != 'string' && json.type == null)) {
      throw 'json cannot be parsed';
    }

    if (typeof json == 'string') {
      return FeatureConstraint.fromJson(json);
    }

    switch (json.type) {
    case 'and':
      return AndConstraint.fromJson(json);
    case 'feature':
      return FeatureConstraint.fromJson(json);
    case 'iff':
      return IffConstraint.fromJson(json);
    case 'implies':
      return ImplicationConstraint.fromJson(json);
    case 'not':
      return NegatedConstraint.fromJson(json);
    case 'or':
      return OrConstraint.fromJson(json);
    case 'xor':
      return XorConstraint.fromJson(json);
    }
  }

  /////////////////////////////
  // Parsing and Loading XML //
  /////////////////////////////

  static fromXml(xml) {
    if (xml == null) {
      throw 'xml cannot be parsed';
    }

    switch (xml.name) {
    case 'conj':
      return AndConstraint.fromXml(xml);
    case 'var':
      return FeatureConstraint.fromXml(xml);
    case 'eq':
      return IffConstraint.fromXml(xml);
    case 'imp':
      return ImplicationConstraint.fromXml(xml);
    case 'not':
      return NegatedConstraint.fromXml(xml);
    case 'disj':
      return OrConstraint.fromXml(xml);
    case 'xor':
      return XorConstraint.fromXml(xml);
    }
  }
}

class FeatureConstraint extends Constraint {
  constructor(featureName) {
    super();
    this.feature = featureName;
  }

  evaluate(helper) {
    return helper.isAdded(this.feature);
  }

  toString() {
    return this.feature;
  }

  /////////////////////////
  // Parsing and Loading //
  /////////////////////////

  toJson() {
    return {
      type: 'feature',
      feature: this.feature
    };
  }

  static fromJson(json) {
    if (typeof json == 'string') {
      return new FeatureConstraint(json);
    }

    return new FeatureConstraint(json.feature);
  }

  toXml(parentNode) {
    const xml = parentNode.startElement('var');
    xml.text(this.feature);
    xml.endElement();
  }

  static fromXml(xml) {
    return new FeatureConstraint(xml.val);
  }
}

class NegatedConstraint extends Constraint {
  constructor(constraint) {
    super();
    this.constraint = constraint;
  }

  evaluate(helper) {
    return !this.constraint.evaluate(helper);
  }

  toString() {
    return '!' + this.constraint;
  }

  /////////////////////////
  // Parsing and Loading //
  /////////////////////////

  toJson() {
    return {
      type: 'not',
      constraint: this.constraint.toJson()
    };
  }

  static fromJson(json) {
    return new NegatedConstraint(Constraint.fromJson(json.constraint));
  }

  toXml(parentNode) {
    const xml = parentNode.startElement('not');
    this.constraint.toXml(xml);
    xml.endElement();
  }

  static fromXml(xml) {
    return new NegatedConstraint(Constraint.fromXml(xml.children[0]));
  }
}

class BinaryConstraint extends Constraint {
  constructor(first, second, symbol, type, typeXml) {
    super();
    this.type = type;
    if (typeXml) {
      this.typeXml = typeXml;
    } else {
      this.typeXml = type;
    }
    this.symbol = symbol;
    this.first = first;
    this.second = second;
  }

  toString() {
    return `(${this.first} ${this.symbol} ${this.second})`;
  }

  /////////////////////////
  // Parsing and Loading //
  /////////////////////////

  toJson() {
    return {
      type: this.type,
      first: this.first.toJson(),
      second: this.second.toJson()
    };
  }

  toXml(parentNode) {
    const xml = parentNode.startElement(this.typeXml);
    this.first.toXml(xml);
    this.second.toXml(xml);
    xml.endElement();
  }
}

class AndConstraint extends BinaryConstraint {
  constructor(first, second) {
    super(first, second, 'AND', 'and', 'conj');
  }

  evaluate(helper) {
    return this.first.evaluate(helper) && this.second.evaluate(helper);
  }

  static fromJson(json) {
    return new AndConstraint(
      Constraint.fromJson(json.first),
      Constraint.fromJson(json.second)
    );
  }

  static fromXml(xml) {
    return new AndConstraint(
      Constraint.fromXml(xml.children[0]),
      Constraint.fromXml(xml.children[1])
    );
  }
}

class OrConstraint extends BinaryConstraint {
  constructor(first, second) {
    super(first, second, 'OR', 'or', 'disj');
  }

  evaluate(helper) {
    return this.first.evaluate(helper) || this.second.evaluate(helper);
  }

  static fromJson(json) {
    return new OrConstraint(
      Constraint.fromJson(json.first),
      Constraint.fromJson(json.second)
    );
  }

  static fromXml(xml) {
    return new OrConstraint(
      Constraint.fromXml(xml.children[0]),
      Constraint.fromXml(xml.children[1])
    );
  }
}

class ImplicationConstraint extends BinaryConstraint {
  constructor(first, second) {
    super(first, second, '=>', 'implies', 'imp');
  }

  evaluate(helper) {
    const equivalentConstraint =
      new OrConstraint(new NegatedConstraint(this.first), this.second);
    let result = equivalentConstraint.evaluate(helper);

    if (!result) {
      if (this.first.evaluate(helper)) {
        if (this.second.constructor.name == 'FeatureConstraint') {
          helper.add(this.second.toString());
        }
        result = equivalentConstraint.evaluate(helper);
      }
    }

    return result;
  }

  static fromJson(json) {
    return new ImplicationConstraint(
      Constraint.fromJson(json.first),
      Constraint.fromJson(json.second)
    );
  }

  static fromXml(xml) {
    return new ImplicationConstraint(
      Constraint.fromXml(xml.children[0]),
      Constraint.fromXml(xml.children[1])
    );
  }
}

class IffConstraint extends BinaryConstraint {
  constructor(first, second) {
    super(first, second, '<=>', 'iff', 'eq');
  }

  evaluate(helper) {
    const equivalentConstraint =
      new AndConstraint(
        new ImplicationConstraint(this.first, this.second),
        new ImplicationConstraint(this.second, this.first)
      );

    return equivalentConstraint.evaluate(helper);
  }

  static fromJson(json) {
    return new IffConstraint(
      Constraint.fromJson(json.first),
      Constraint.fromJson(json.second)
    );
  }

  static fromXml(xml) {
    return new IffConstraint(
      Constraint.fromXml(xml.children[0]),
      Constraint.fromXml(xml.children[1])
    );
  }
}

class XorConstraint extends BinaryConstraint {
  constructor(first, second) {
    super(first, second, 'v', 'xor');
  }

  evaluate(helper) {
    return this.first.evaluate(helper) ?
      !this.second.evaluate(helper) : this.second.evaluate(helper);
  }

  static fromJson(json) {
    return new XorConstraint(
      Constraint.fromJson(json.first),
      Constraint.fromJson(json.second)
    );
  }

  static fromXml(xml) {
    return new XorConstraint(
      Constraint.fromXml(xml.children[0]),
      Constraint.fromXml(xml.children[1])
    );
  }
}
