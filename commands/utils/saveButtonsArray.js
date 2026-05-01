const { saveButton } = require('./saveButton.js');

function saveButtonsArray(channelId, messageId, buttons) {
  for (const btn of buttons) {
    saveButton({
      channelId,
      messageId,
      customId: btn.data.custom_id
    });
  }
}


module.exports = { saveButtonsArray }