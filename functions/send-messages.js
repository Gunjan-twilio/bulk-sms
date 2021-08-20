exports.handler = function (context, event, callback) {
  const { messages, passcode, from, messagingServiceSid, statusCallback } = event;

  if (passcode !== context.PASSCODE) {
    const response = new Twilio.Response();
    response.setStatusCode(403);
    response.setBody('Invalid passcode');
    return callback(null, response);
  }

  if (!messages || messages.length <= 0) {
    const response = new Twilio.Response();
    response.setStatusCode(400);
    response.setBody('Missing messages');
    return callback(null, response);
  }

  const client = context.getTwilioClient();
  const allMessageRequests = messages.map((message) => {
    //console.log(message.to);
    return client.messages
      .create({
        from: from,
        to: message.to,
        messagingServiceSid: messagingServiceSid,
        body: message.body,
        statusCallback: statusCallback
      })
      .then((msg) => {
        let resultData = { id: message.id, success: true, message: msg };
        //console.log(resultData);
        return resultData;
      })
      .catch((err) => {
        let resultData =  { id: message.id, success: false, error: {message: err.message, ...err}};
        //console.log(resultData);
        return resultData;
      });
  });

  Promise.all(allMessageRequests)
    .then((results) => {
      return callback(null, { results });
    })
    .catch((err) => {
      console.error(err);
      return callback('Failed to fetch messages');
    });
};
