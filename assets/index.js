const recipientForm = document.getElementById('recipientForm');
const sendNotificationForm = document.getElementById('sendNotificationForm');
const newRecipientInput = document.getElementById('newRecipientInput');
const recipientList = document.getElementById('recipients');
const resultSection = document.getElementById('resultSection');

const recipients = [];

function addRecipient(receipientData) {
  recipients.push(receipientData);
  const newListItem = document.createElement('li');
  newListItem.innerText = 'Recipient Id:' + receipientData.RecepientId + ' Phone Number:' +  receipientData.PhoneNumber;
  recipientList.appendChild(newListItem);
}

function clearForm(form) {
  // only clearing the passcode and leaving the message for convience
  form.passcode.value = '';
}

recipientForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (newRecipientInput.value) {
    for (let i = 0; i < 10; i++) {
      const receipientData =  {PhoneNumber: newRecipientInput.value, RecepientId: recipients.length, SMSId: null};
      addRecipient(receipientData);
    }
    
    newRecipientInput.value = '';
  }
});

function sendMessages(form) {
  const data = {
    passcode: form.passcode.value,
    message: form.message.value,
    recipients: recipients,
  };

  clearForm(form);

  fetch('send-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      } else {
        if (resp.status === 401) {
          throw new Error('Invalid Passcode');
        } else {
          throw new Error(
            'Unexpected error. Please check the logs for what went wrong.'
          );
        }
      }
    })
    .then((body) => {
      const successCount = body.result.reduce((currentCount, resultItem) => {
        return resultItem.success ? currentCount + 1 : currentCount;
      }, 0);

      resultSection.innerText = `Sent ${successCount} of ${body.result.length} messages. Check logs for details`;
    })
    .catch((err) => {
      resultSection.innerText = err.message;
    });
}

sendNotificationForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (recipients.length === 0 && newRecipientInput.value) {
    addRecipient(newRecipientInput.value);
    newRecipientInput.value = '';
  }

  if (recipients.length === 0) {
    resultSection.innerText = 'Please enter at least one phone number';
  } else {
    resultSection.innerText = 'Sending messages. One moment';
    sendMessages(evt.target);
  }
});
