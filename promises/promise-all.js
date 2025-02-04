'use strict';

function all(promise1, promise2) {
    return new Promise(function (fulfill, reject) {
        let counter = 0;
        let values = [];

        promise1.then(function (value) {
            values[0] = value;
            counter++;
            if (counter === 2) fulfill(values);
        }).catch(reject);

        promise2.then(function (value) {
            values[1] = value;
            counter++;
            if (counter === 2) fulfill(values);
        }).catch(reject);
    });
}

all(getPromise1(), getPromise2())
    .then(console.log);
