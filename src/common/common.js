export const VILLES = [
  "Paris",
  "Bordeaux",
  "Lille",
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

export const lpad = (number, width = 2, character = '0') => {
  number = number + '';
  return number.length >= width ? number : new Array(width - number.length + 1).join(character) + number;
};

export const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject("Promise canceled") : resolve(val),
      error => hasCanceled_ ? reject("Promise canceled") : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};