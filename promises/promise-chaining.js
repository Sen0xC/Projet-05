'use strict';

// Assuming first and second are globally available functions
first()  
    .then(function(value) {
        return second(value);
    })
    .then(console.log);
