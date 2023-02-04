const { promiseImpl } = require('ejs');

const accountSid = 'ACe61c99042a6942d32c563933f9431c78';
const serviceid = 'VA3a22d4de471a465c529e4d6cd316a326';
const authToken = 'fae507a7d1eef4b78b948e65a628bed5';
const client = require('twilio')(accountSid, authToken);

   function sentOtp(mobile){
        console.log("start");
        client.verify.v2.services(serviceid)
        .verifications
        .create({to: `+91${mobile}`, channel: 'sms'})
        .then(verification => console.log(verification.status));
    }
     
    function verifyOtp(mobile,otp){
        return new Promise((resolve,reject)=>{
            client.verify.v2.services(serviceid)
          .verificationChecks
          .create({to: `+91${mobile}`, code: otp})
          .then((verification_check) =>{ console.log(verification_check.status)
          resolve(verification_check)
        });
        }).catch((verification_check) =>{ console.log(verification_check.status)
            resolve(verification_check)})
    }
    
        


module.exports={
    sentOtp,
    verifyOtp
}
    
