const helpers = {}

helpers.randomNumber = () =>{
    let possible = 'qwertyuiopasdfghjklzxcvbnm0123456789';
    let randomNumber = 0;
    for (let i = 0; i < 15; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length)); //que me de un numero aleatorio
    }
    return randomNumber;
}

module.exports = helpers;