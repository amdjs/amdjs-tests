var configuredRequire = require.config({});

doh.register(
    "globalRequireConfig/basic",
    [
        function globalRequireConfigBasic(t){
            t.is('function', typeof configuredRequire);
        }
    ]
);
doh.run();
