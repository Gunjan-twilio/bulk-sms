exports.handler = function (context, event, callback) {
  const phoneNumbers = event.recipients;
  const message = event.message;
  const passcode = event.passcode;

  if (passcode !== context.PASSCODE) {
    const response = new Twilio.Response();
    response.setStatusCode(401);
    response.setBody('Invalid passcode');
    return callback(null, response);
  }

  const client = context.getTwilioClient();
  const allMessageRequests = phoneNumbers.map((recepient) => {
    console.log(recepient);
    return client.messages
      .create({
        from: context.TWILIO_PHONE_NUMBER,
        to: recepient.PhoneNumber,
        body: message,
      })
      .then((msg) => {
        let resultData = { recepientId: recepient.RecepientId, phone_number: recepient.PhoneNumber, success: true, sid: msg.sid };
        console.log(resultData);
        return resultData;
      })
      .catch((err) => {
        let resultData =  { recepientId: recepient.RecepientId, phone_number: recepient.PhoneNumber, success: false, error: err.message };
        console.log(resultData);
        return resultData;
      });
  });

  Promise.all(allMessageRequests)
    .then((result) => {
      return callback(null, { result });
    })
    .catch((err) => {
      console.error(err);
      return callback('Failed to fetch messages');
    });
};
