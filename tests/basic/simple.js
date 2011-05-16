go(['one', 'two'], function (one, two) {

    doh.register(
        "basic/simple",
        [
            function simple(t){
                t.is('one', one.name);
                t.is('two', two.name);
                t.is('three', two.threeName);
            }
        ]
    );
    doh.run();

});
