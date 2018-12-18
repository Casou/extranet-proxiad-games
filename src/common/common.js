export const VILLES = [
    "Lille",
    "Paris",
    "Bordeaux",
    "Nantes",
    "Rouen",
    "Aix en Provence",
    "Bulgarie",
    "Strasbourg",
    "Lyon"
];

export const makeid = (length = 9) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};