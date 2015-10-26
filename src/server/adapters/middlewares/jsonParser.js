export default function jsonParser(_adapter, message) {
  return Object.assign(message, {parsedMessage: JSON.parse(message.originalMessage)})
}
