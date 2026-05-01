const fs = require('fs');
const path = require('path');
const buttonsPath = path.join(__dirname, '../../json/buttons.json');
let savedButtons = require(buttonsPath);

/* formato para salvar:
channelId,
messageId,
customId
*/
function saveButton(buttonData) {
  if (!buttonData.channelId || !buttonData.messageId || !buttonData.customId) throw new Error('SyntaxError: you miss some argument of \'saveButton()\'')
  
  savedButtons.buttons.push(buttonData);
  fs.writeFileSync(buttonsPath, JSON.stringify(savedButtons, null, 2));
}

module.exports = { saveButton }