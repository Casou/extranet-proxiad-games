const AVAILABLE_COMMANDS = [
    { command : "help", description : "Liste les commandes" },
    { command : "unlock", description : "Débloque les verrous" },
    { command : "clean", description : "Nettoie les commandes précédentes" },
];


export const handleCommand = (command) => {
    return new Promise((resolve, reject) => {
        if (command.trim() === 'help') {
            resolve({
                text : getHelpString(),
                isProgress : false
            });
        }
        if (command.split(" ")[0] === 'unlock') {
            resolve(handleUnlock(command));
        }

        reject({ text : "Unknown command '" + command.split(" ")[0] + "'" });
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

    const arg1 = args[1];
    if (arg1 === '-list') {
        returnObject.text = `
            <ul class="lock_list">
                <li><span class="lock_status unlocked">UNLOCKED</span> <span>Enigme 1</span></li>
                <li><span class="lock_status locked">LOCKED</span> <span>Enigme 2</span></li>
                <li><span class="lock_status locked">LOCKED</span> <span>Enigme 3</span></li>
            </ul>
        `;
        return returnObject;
    }

    returnObject.text = "Unlock successful";
    returnObject.isProgress = true;
    return returnObject;
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
}