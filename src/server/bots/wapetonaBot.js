const emojis = {
  "01": "\u2600\uFE0F", // clear sky
  "02": "\u26c5", // few clouds
  "03": "\u2601\uFE0F", // scattered clouds
  "04": "\u2601\uFE0F", // broken clouds
  "09": "\u2614", // shower rain
  "10": "\u2614", // rain
  "11": "\u26a1", // thunderstorm
  "13": "\u2744\uFE0F", // snow
  "50": "\ud83c\udf01" // mist
}

function toLatLon(location) {
  return {
    lat: location.lat || location.latitude,
    lon: location.lon || location.longitude
  }
}

async function weather(msg, location, cb) {
  const params = {
    uri: "http://api.openweathermap.org/data/2.5/weather",
    qs: {
      "lat": location.lat,
      "lon": location.lon,
      "units": "metric",
      "appid": process.env.OPENWHEATER
    },
    json: true
  }

  const res = await msg.http.get(params)
  console.dir(res)
  const emoji = emojis[res.body.weather[0].icon.slice(0, 2)]
  const temp = `${emoji} ${res.body.main.temp}\u00b0`
  const humidty = `\ud83d\udca6 ${res.body.main.humidity}%`
  const wind = `\ud83d\udca8 ${res.body.wind.speed} m/s`
  cb(`${temp} ${humidty} ${wind}`)
}

export default (_app) =>
  class WapetonaBot {
    constructor() {
      this.name = "WapetonaBot"
    }

    onMessage(msg) {

      if (msg.location) {
        weather(msg, toLatLon(msg.location), text => msg.send(text))
      }

      msg.hear(/(\W|^)(holi)(\W|$)/i, _match => {
        msg.send(msg.sample(["Holii!!", "Holi", "Holi", "Morning!"]))
      })

      msg.command("cat", async _match => {
        const {headers} = await msg.http.get("http://thecatapi.com/api/images/get?format=src")
        msg.send(headers.location)
      })

      msg.command("location", async match => {
        console.log("location command")
        const {body} = await msg.http.get({
          uri: "http://nominatim.openstreetmap.org/search",
          qs: {
            format: "json",
            addressdetails: 1,
            q: match[0]
          }
        })
        JSON.parse(body).slice(0, 3).forEach( async place => {
          console.log("sending location")
          await msg.sendLocation(place)
          await msg.send(place.display_name)
          weather(msg, toLatLon(place), async text => await msg.send(text))
        })
      })
    }
  }
