config({
    config: {
        a: {
            id: 'magic'
        }
    }
});

go({
        baseUrl: './',
        config: {
            'b/c': {
                id: 'beans'
            }
        }
    },
    ['a', 'b/c', 'plain'],
    function(a, c, plain) {
        doh.register(
            'moduleConfig',
            [
                function moduleConfig(t){
                    t.is('magic', a.type);
                    t.is('beans', c.food);
                    t.is('plain', plain.id);
                }
            ]
        );
        doh.run();
    }
);
