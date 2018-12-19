import React from 'react';

const AVAILABLE_COMMANDS = [
    { command : "help", description : "List all commands" },
    { command : "unlock", description : "Unlock bolts" },
    { command : "clean", description : "Erase previous command in the console" },
    { command : "terminator", description : "Give a root access to the AI on all your computers (you lost half of your remaining time)" },
];



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


export const handleCommand = (command, riddleStatus) => {
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
                resolve(handleUnlock(args, riddleStatus));
            } catch(e) {
                reject({ text : e });
            }
        }

        if (args[0] === 'terminator') {
            try {
                resolve(handleTerminator(args));
            } catch(e) {
                reject({ text : e });
            }
        }

        if (args[0] === 'redpill') {
            try {
                resolve(handleRedPill(args));
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

const handleUnlock = (args, riddleStatus) => {
    const returnObject = {
        text : null,
        isProgress : false
    };

    if (args.length === 1) {
        returnObject.text = `
        <div>
            <div>The unlock command should be used with parameter(s) : </div>
            <table class="list_command_table">
                <tbody>
                    <tr><td>-list</td><td>List bolts</td></tr>
                    <tr><td>-i, -id &lt;id&gt;</td><td>Bolt id to open</td></tr>
                    <tr><td>-p, -pass &lt;password&gt;</td><td>Bolt password</td></tr>
                </tbody>
            </table>
            <div>Example : unlock -id bolt1 -pass firstPassword</div>
        </div>
        `;

        return returnObject;
    }

    const options = {
        index : 1
    };
    for (options.index; options.index < args.length; options.index++) {
        parseParam(options, args);
    }

    if (options.list) {
        if (options.id || options.password) {
            throw new Error("The -list option should be used alone");
        }
        returnObject.text =
                `<ul class="lock_list">
                    ${ Object.entries(riddleStatus).map(entry => 
                        renderRiddleItem(entry[0], entry[1])
                    ).join("") }
                </ul>`
            ;
        if (!Object.entries(riddleStatus).filter(entry => !entry[1]).length) {
            returnObject.text += `<br/>
                All riddles unlocked. Type '<b>redpill</b>' to infiltrate the AI. 
            `;
        }
        return returnObject;
    }
    if (options.id) {
        if (!options.password) {
            throw new Error("You should set a password.");
        }

        returnObject.unlock = options;
        return returnObject;
    }
    if (options.password) {
        throw new Error("You should set an id.");
    }

    return returnObject;
};

const renderRiddleItem = (id, status) => {
    return `
        <li>
            ${ status ?
                `<i class="fa fa-unlock"></i><span class="lock_status unlocked">UNLOCKED</span>` :
                `<i class="fa fa-lock"></i><span class="lock_status locked">LOCKED</span>` }
    
            <span>Riddle [<i>${ id }</i>]</span>
        </li>
    `;
};

const parseParam = (options = {}, args) => {
    const arg1 = args[options.index];
    if (arg1 === '-list') {
        options.list = true;
        return options;
    }

    if (arg1 === '-id' || arg1 === '-i') {
        if (args.length <= options.index + 1) {
            throw new Error("Error : the -id option should been followed by the id of the riddle.")
        }
        options.index++;
        const arg2 = args[options.index];
        if (arg2.substring(0, 1) === '-') {
            throw new Error("Error : the -id option should been followed by the id of the riddle.")
        }
        options.id = arg2;
        return options;
    }

    if (arg1 === '-pass' || arg1 === '-p') {
        if (args.length <= options.index + 1) {
            throw new Error("Error : the -pass option should been followed by the password of the riddle.")
        }
        options.index++;
        const arg2 = args[options.index];
        if (arg2.substring(0, 1) === '-') {
            throw new Error("Error : the -pass option should been followed by the password of the riddle.")
        }
        options.password = arg2;
        return options;
    }

    throw new Error("Unknown argument '" + arg1 + "'");
};

const handleTerminator = (args) => {
    const returnObject = {
        text : null,
        isProgress : false
    };

    if (args.length === 1) {
        returnObject.text = `
        <div>
            Are you sure you want to use the terminator command and waste half of your remaining time ?
            If so, type the command <i>'terminator -F'</i>.
        </div>
        `;

        return returnObject;
    }

    if (args[1] !== '-F') {
        throw new Error("Unrecognized argument : " + args[1]);
    }

    returnObject.text = "Root access granted to the AI... asshole...";
    returnObject.isProgress = true;
    returnObject.progressStep = 3;

    return returnObject;
};

const handleRedPill = () => {
    const returnObject = {
        text : '<br/><br/><div class="access_granted"><span>Access granted</span></div><br/>',
        isProgress : false,
        redpill : true
    };

    return returnObject;
};