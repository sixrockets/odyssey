export default function messageFiller({driver}, msg) {
  return Object.assign(msg, { driver, device: driver.name })
}
