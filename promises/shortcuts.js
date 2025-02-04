'use strict';
require('es6-promise');

// Using Promise.resolve
Promise.resolve('SUCCESS!')
    .then(console.log);

// Using Promise.reject and catch
Promise.reject(new Error('OH NOES'))
    .catch(function(err) {
        console.log('Error:', err.message);
    });

// Demonstrating Promise.resolve and Promise.reject with a delay
var promise1 = new Promise(function (fulfill, reject) {
    fulfill('I FIRED');
});

var promise2 = new Promise(function (fulfill, reject) {
    reject(new Error('I DID NOT FIRE'));
});

promise1.then(console.log);
promise2.catch(function(err) {
    console.log(err.message);
});
