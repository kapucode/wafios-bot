const path = require('path')
const fs = require('fs')
const filePath = path.join(__dirname, '../../json/botManagers.json')


function isManager(client, id) {
  return client.managers.get(id) ? true : false
}

module.exports = { isManager }