'use strict';

function parsePromised(json) {
    return new Promise(function (fulfill, reject) {
        try {
            fulfill(JSON.parse(json));
        } catch (error) {
            reject(error);
        }
    });
}

parsePromised(process.argv[2])
    .then(console.log)
    .catch(function (error) {
        console.log(error.message);
    });
