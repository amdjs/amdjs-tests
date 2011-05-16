define('two', ['sub/three'], function (three) {
    return {
        name: 'two',
        threeName: three.name
    };
});
