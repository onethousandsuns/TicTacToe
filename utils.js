

function createToken(tokenLength) {
    var text = "";
    var possible = "abcdef0123456789";

    for (var i = 0; i < tokenLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

exports.createToken = createToken;