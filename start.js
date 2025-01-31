const { exec } = require('child_process');

const args = process.argv.slice(2);
const noConsole = args.includes('--no-console');

const command = `npx electron --trace-warnings ./main.js${noConsole ? ' --no-console' : ''}`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
