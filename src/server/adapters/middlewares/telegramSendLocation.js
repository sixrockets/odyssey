export default async function telegramSendLocation({driver}, msg) {
  const chatId = msg.parsedMessage.chat.id

  msg.sendLocation = loc => driver.client.sendLocation(chatId, loc)

  return msg
}

