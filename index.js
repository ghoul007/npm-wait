#!/usr/bin/env node

const http = require('http');
const { program } = require('commander');


(async () => {

    program
        .option('-u, --url <type>')
        .option('-m, --method <type>')
        .option('-p, --port <type>')
        .option('-pa, --path <type>')
        .parse(process.argv);

    const hostname = program.url;
    const method = program.method;
    const port = program.port;
    const path = program.path;


    if (!hostname || !method || !port) { throw new Error('missing flag ') }

    return new Promise(resolve => {
        const retry = ms => () => setTimeout(check, ms);

        const check = () => {
            const request = http.request({ hostname, method, port, path }, response => {
                if (response.statusCode === 200) {
                    return resolve();
                }

                retry(500)();
            });

            request.on('error', retry(500));
            request.end();
        };

        check();
    });


})()