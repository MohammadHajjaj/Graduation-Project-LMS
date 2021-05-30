const accountSid = "AC168fe5d7f7067f06ca42a2a7098c446f";
const authToken = "e609ca769227a898e5d2c8eef3342279";
const client = require('twilio')(accountSid, authToken);


module.exports.sendVerificationEmail = (email) => {
    client.verify.services('VA758873ecc9e16ade3f935c5b59985c2f')
        .verifications
        .create({ to: email, channel: 'email' })
        .then(verification => console.log(verification.sid));

}

module.exports.verifyCode = (email, code) => {
    client.verify.services('VA758873ecc9e16ade3f935c5b59985c2f')
        .verificationChecks
        .create({ to: email, code })
        .then(verification_check => {
            console.log(verification_check.status)
            return verification_check.status
        });
}
