go(     ["_reporter", "require", "earth", "prime/earth"],
function (amdJS,       require,   earth,   primeEarth) {
  amdJS.assert('a' === earth.getA().name, 'plugin_normalize: earth.getA().name');
  amdJS.assert('c' === earth.getC().name, 'plugin_normalize: earth.getC().name');
  amdJS.assert('b' === earth.getB().name, 'plugin_normalize: earth.getB().name');
  amdJS.assert('aPrime' === primeEarth.getA().name, 'plugin_normalize: primeEarth.getA().name is aPrime, not a');
  amdJS.assert('cPrime' === primeEarth.getC().name, 'plugin_normalize: primeEarth.getC().name is cPrime, not c');
  amdJS.assert('bPrime' === primeEarth.getB().name, 'plugin_normalize: primeEarth.getB().name is bPrime, not b');
  amdJS.print('DONE', 'done');
});
