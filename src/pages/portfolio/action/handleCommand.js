const AVAILABLE_COMMANDS = [
    { command : "help", description : "List all commands" },
    { command : "unlock", description : "Unlock bolts" },
    { command : "clean", description : "Erase previous command in the console" },
    { command : "terminator", description : "Give a root access to the AI on all your computers (you lost half of your remaining time)" },
];


export const handleCommand = (command) => {
    return new Promise((resolve, reject) => {
        if (command.trim() === 'help') {
            resolve({
                text : getHelpString(),
                isProgress : false
            });
        }

        let args = command.split(" ");
        if (args[0] === "sudo") {
            args = args.slice(1);
        }

        if (args[0] === 'unlock') {
            try {
                resolve(handleUnlock(command));
            } catch(e) {
                reject({ text : e });
            }
        }

        reject({ text : "Unknown command '" + args[0] + "'" });
    });
};

const getHelpString = () => {
    return '<table class="list_command_table"><tbody>'
        + AVAILABLE_COMMANDS.map(entry =>
            `<tr>
                <td>${ entry.command }</td>
                <td>${ entry.description }</td>
            </tr>`
        ).join("")
        + '</tbody></table>';
};

const handleUnlock = (command) => {
    const args = command.split(" ");
    const returnObject = {
        text : null,
        isProgress : false
    };

    if (args.length === 1) {
        returnObject.text = `
        <div>
            <div>Utilisez un des arguments suivants : </div>
            <table class="list_command_table">
                <tbody>
                    <tr><td>-list</td><td>Liste les verrous</td></tr>
                    <tr><td>-id &lt;id&gt;</td><td>L'id du verrou à ouvrir</td></tr>
                    <tr><td>-pass &lt;password&gt;</td><td>Le mot de passe pour ouvrir le verrou</td></tr>
                </tbody>
            </table>
            <div>Exemple : unlock -id verrou1 -pass premierPassword</div>
        </div>
        `;

        return returnObject;
    }

    const options = {};
    for (let index = 1; index < args.length; index++) {
        parseParam(options, args, index);
    }

    if (options.list) {
        if (options.id || options.password) {
            throw new Error("The -list option should be used alone");
        }
        returnObject.text = `
                <ul class="lock_list">
                    <li><span class="lock_status unlocked">UNLOCKED</span> <span>Enigme 1</span></li>
                    <li><span class="lock_status locked">LOCKED</span> <span>Enigme 2</span></li>
                    <li><span class="lock_status locked">LOCKED</span> <span>Enigme 3</span></li>
                </ul>
            `;
        return returnObject;
    }

    // returnObject.text = "Unlock successful";
    // returnObject.isProgress = true;
    return returnObject;
};

const parseParam = (options = {}, args, index) => {
    const arg1 = args[index];
    if (arg1 === '-list') {
        options.list = true;
        return options;
    }

    if (arg1 === '-id') {
        if (args.length < index + 1) {
            throw new Error("Error : the -id option should been followed by the id of the riddle.")
        }
        index++;
        const arg2 = args[index];
        if (arg2.substring(0, 1) === '-') {
            throw new Error("Error : the -id option should been followed by the id of the riddle.")
        }
        options.id = arg2;
        return options;
    }

    if (arg1 === '-pass') {
        if (args.length < index + 1) {
            throw new Error("Error : the -pass option should been followed by the password of the riddle.")
        }
        index++;
        const arg2 = args[index];
        if (arg2.substring(0, 1) === '-') {
            throw new Error("Error : the -pass option should been followed by the password of the riddle.")
        }
        options.password = arg2;
        return options;
    }

    return options;
};


export const progressbar = (percent, width) => {
    const size = Math.round(width*percent/100);
    let left = '', taken = '', i;
    for (i=size; i--;) {
        taken += '=';
    }
    if (taken.length > 0) {
        taken = taken.replace(/=$/, '>');
    }
    for (i=width-size; i--;) {
        left += '&nbsp;';
    }
    return '[' + taken + left + '] ' + percent + '%';
};