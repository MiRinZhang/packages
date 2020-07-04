const fs = require('fs');
const { resolve } = require('path');
const { exec } = require('child_process');

function buildPackages(packageRootPath) {
    const dirs = fs.readdirSync(packageRootPath);

    dirs.forEach(filename => {
        const packagePath = packageRootPath + '/' + filename;
        const stat = fs.statSync(packagePath);

        if (stat.isDirectory()) {
            exec(
                `cd ${packagePath} && node ../../scripts/compile.js`,
                (err, stdout) => {
                    if (err) {
                        console.error(
                            `Build package [${filename}] failed`,
                            err
                        );
                        return;
                    }
                    console.log(`Build package [${filename}] success`);
                }
            );
        }
    });
}

buildPackages(resolve(__dirname, '../packages'));
