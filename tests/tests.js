(function () {
    var suffix = '.html' + location.search,
        levelNames = [
            'basic'
        ],
        i, levels;

    //Convenience function to register test.
    function reg(testName, timeout) {
        doh.registerUrl(testName, '../' + testName + suffix, timeout);
    }

    //Define the tests for each level.
    levels = {
        basic: function () {
            reg('basic/defineAmd');
            reg('basic/simple');
        }

        //basic: true, //include function callback and basic object callback.
        //simple circular dependencies
        //anonymous: true, //include function callback and basic object callback.
        //commonJsWrapper: true,

    };

    //Cycle through the level names, if the config , and call the tests
    for (i = 0; (name = levelNames[i]); i++) {
        if (implemented[name]) {
            levels[name]();
        }
    }
}());
