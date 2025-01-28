const { exec } = require('child_process');
const path = require('path')

// Function to run a command and return a promise
function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`);
                console.error(stderr);
                reject(error);
            } else {
                console.log(stdout);
                resolve();
            }
        });
    });
}

async function buildAndTranspile() {
    try {
        // Step 1: Run bun build command
        console.log('Running bun build...');
        await runCommand('bun build --outfile=./dist/pre-babel-bundle.js ./src/index.ts');

        // Step 2: Run babel command
        console.log('Running babel...');
        await runCommand(path.resolve(__dirname, 'node_modules/.bin/babel ./dist/pre-babel-bundle.js --out-file ./dist/bundle.js'));


        await runCommand(`"C:\\Program Files\\Adobe\\Adobe After Effects 2025\\Support Files\\AfterFX.exe" -r ${path.resolve(__dirname, './dist/bundle.js')}`)

        console.log('Build and transpilation completed successfully.');
    } catch (error) {
        console.error('Build and transpilation failed:', error);
    }
}

// Execute the build and transpile process
buildAndTranspile();
