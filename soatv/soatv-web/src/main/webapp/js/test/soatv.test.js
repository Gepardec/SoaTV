// To run this test just run nodeunit soatv.test.js

eval(require('fs').readFileSync('../classes/soatv.model.js', 'utf8'));
eval(require('fs').readFileSync('../classes/soatv.transformation.js', 'utf8'));

function copyProps(from, to) {
    for (var key in from) {
        to[key] = from[key];
    }
}

//eval(require('fs').readFileSync('../classes/soatv.model.js', 'utf8'));
var modelTest = require("./soatv.model.test.js");
copyProps(modelTest, exports);

var transformationTest = require("./soatv.transformation.test.js");
copyProps(transformationTest, exports);