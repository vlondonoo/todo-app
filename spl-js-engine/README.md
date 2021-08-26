# spl-js-engine

Software Product Line JavaScript Derivation Engine

## Requirements

- Node (> v6.9.4)
- NPM (> 3.10.10)

## Install with npm

`npm install spl-js-engine --save-dev`
`npx spl-js-engine help`

## Install from github

- `git clone https://github.com/AlexCortinas/spl-js-engine.git`: Clone the repo
- `npm install`: Installation.
- `[sudo] npm link`: Globally link the client so `spl-js-engine` can be run anywhere.
- `npm test`: Run all test.
- `spl-js-engine help`: Usage page.

## Examples (github)

### My Calculator

A simple web-based calculator made with Spring Boot and Angular

Generation of the product:

```bash
cd examples/MyCalculator
[npx] spl-js-engine --featureModel model.json \
    --product product.json \
    --config config.json \
    --extra extra.js \
    --code code \
    --output output
    [--verbose]
```

Running the generated product:

```bash
cd output
npm install
mvn spring-boot:run
#CUSTOM PORT
#mvn spring-boot:run -Drun.arguments="--server.port=8181"

#use new dependecies
#          <dependency>
#             <groupId>javax.xml.bind</groupId>
#             <artifactId>jaxb-api</artifactId>
#             <version>2.3.0</version>
#         </dependency>
#         <dependency>
#             <groupId>com.sun.xml.bind</groupId>
#             <artifactId>jaxb-impl</artifactId>
#             <version>2.3.0</version>
#         </dependency>
#         <dependency>
#             <groupId>com.sun.xml.bind</groupId>
#             <artifactId>jaxb-core</artifactId>
#             <version>2.3.0</version>
#         </dependency>
#         <dependency>
#             <groupId>javax.activation</groupId>
#             <artifactId>activation</artifactId>
#             <version>1.1.1</version>
#         </dependency>

# open http://localhost:8080/ on any web browser
```
