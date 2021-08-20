# SMS Notifications

Send SMS messages in Bulk

## Deployment

### Environment variables

This project requires some environment variables to be set. 
Rename the `.env.sample` file into `.env`, and set the following values:

```markdown
PASSCODE=YourOwnPasscode
```

| Variable              | Description                                              | Required |
| :-------------------- | :------------------------------------------------------- | :------- |
| `PASSCODE`            | A passcode to avoid anyone sending text messages         | Yes      |


### Deploy to Twilio Functions

1. Install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli)
2. Install the [serverless toolkit](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started)

```shell
twilio plugins:install @twilio-labs/plugin-serverless
```

3. Deploy your functions and assets with either of the following commands. Note: you must run these commands from inside your project folder. [More details in the docs.](https://www.twilio.com/docs/labs/serverless-toolkit)


```
twilio serverless:deploy
```

4. Get your Base URL from the command response. E.g. `https://bulk-sms-1234-dev.twil.io`


## API Request

### Endpoint:
```
{BASE_URL}/send-messages
```

### Method:
```
POST
```

### Content-Type:
```
application/json
``` 

### Parameters:

a `JSON` object with the following keys:

```jsonc
{
    "passcode": "YourOwnPasscode", // string - the PASSCODE defined in your environment variables
    "messagingServiceSid": "MGxxxxxxxxxxxx", // string - messaging service used to send the messages
    "from": "MySenderId", // string (optional) - a valid sender for your SMS
    "statusCallback": "https://webhook", // string (optional) - webhook URL where to send the status updates
    "messages": [ // list of message objects: 
        {
            "id": "a", // string - your own unique id for this message
            "to": "+33xxxxxxxxx", // string - e164 recipient phone number
            "body": "My First Message" // string - content of the message
        }, 
        {
            "id": "b", // string - your own unique id for this message
            "to": "+33xxxxxxxxx", // string - e164 recipient phone number
            "body": "My other Message" // string - content of the message
        },
        ...
    ]
}
```


| Key    | Type | Description                                                                   | Required |
| :----------- | :--- | :---------------------------------------------------------------------------- | :------- |
| `passcode`   | string | The passcode as defined in the environment variables                           | Yes      |
| `messagingServiceSid` | string  | The messaging service to use to send the messages (details [here](https://www.twilio.com/docs/messaging/services))    | Recommended      |
| `from` | string  | A valid sender for your SMS (details [here](https://www.twilio.com/docs/sms/send-messages#from)). Note: we recommend using a messging service instead.                   | Only if `messagingServiceSid` is not provided |
| `statusCallback` | string | Webhook URL where to send the status updates (details [here](https://www.twilio.com/docs/usage/webhooks/sms-webhooks#type-2-status-callbacks)). The webhook can also be set globally from the Twilio Console.                                             | No      |
| `messages` | list | A comma separated list of messages objects (see below) | Yes      |

*Message object:*

| Key | Type | Description                                                                   | Required |
| :------ | :-------- | :---------------------------------------------------------------------------- | :------- |
| `id` | string | Your own unique id for this message                           | Yes      |
| `to` | string | e164 recipient phone number                           | Yes      |
| `body`   | string | The content of the message                           | Yes      |

## API response:

The API will respond with a JSON Object:

```jsonc
{
    "results": [ // list of result objects
        {
            "id": "a", // string - your own unique id as specified in the API call
            "success": true, // boolean - was the call successfull? 
            "message": {   // in case of a successfull call
                "sid": "SMxxxxxxxxxx", // string - the Twilio unique id for your message
                ... // many other details from Twilio
                
            }
        },
        {
            "id": "b", // string - your own unique id as specified in the API call
            "success": false, // boolean - was the call successfull? 
            "error": { // in case of an unsuccessfull call
                "message": "error details...", // string - human-readable error message
                "status": 400, // integer - request status
                "code": 21211, // integer - error code
                "moreInfo": "https://www.twilio.com/docs/errors/xxxxx" // string - url to the error description
            }
        }
    ]
}
```

| Key  | Type  | Description                                                                   | 
| :----------- | :------- | :---------------------------------------------------------------------------- |
| `results` | list  | List of result objects (one for each message in your API call)                    |

*Result object:* 

| Key | Type   | Description                                                                   | 
| :----------- | :---------------------------------------------------------------------------- | :------- |
| `id` | string  | Your own unique id as specified in the API call                           | 
| `success`  | boolean | whether the API call was successful or not. If `true` then `message` is provided. If `false` then `error` is provided.                            | 
| `message`  | object  | The Twilio response for this SMS, including `sid` the Twilio unique id. (details and complete list [here](https://www.twilio.com/docs/sms/api/message-resource#message-properties)) | 
| `error`| object | The Twilio response in case of an error (details [here](https://www.twilio.com/docs/usage/twilios-response#response-formats-exceptions)) | 





