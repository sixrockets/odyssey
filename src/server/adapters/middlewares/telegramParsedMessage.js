export default function telegramParsedMessage(_adapter, message) {
  message.parsedMessage.type = "message"
  return message
}
