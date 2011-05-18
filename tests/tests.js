/*jslint strict: false, plusplus: false */
/*global location: false, doh: false, implemented: false */

(function () {
    var suffix = '.html' + location.search,
        levelNames = [
            'basic',
            'anon',
            'funcString'
        ],
        i, levels, name;

    //Convenience function to register test.
    function reg(testName, timeout) {
        doh.registerUrl(testName, '../' + testName + suffix, timeout);
    }

    //Define the tests for each level.
    levels = {
        basic: function () {
            reg('basic/defineAmd');
            reg('basic/simple');
            reg('basic/circular');
        },

        anon: function () {
            reg('anon/simple');
            reg('anon/circular');
        },

        funcString: function () {
            reg('funcString/funcString')
        }


        //basic: true, //include require, exports, module tests.
        //anonymous: true, //include function callback and basic object callback,
           //circular deps
        //commonJsWrapper: true,

    };

    //Cycle through the level names, if the config , and call the tests
    for (i = 0; (name = levelNames[i]); i++) {
        if (implemented[name]) {
            levels[name]();
        }
    }
}());
