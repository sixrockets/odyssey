var emojis = {
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

var toLatLon = function(location){
  return {
    lat: location.lat || location.latitude,
    lon: location.lon || location.longitude
  }
}

var weather = function(msg, location, cb){
  let params = {
    uri : 'http://api.openweathermap.org/data/2.5/weather',
    qs : {
      "lat": location.lat,
      "lon": location.lon,
      "units": 'metric'
    },
    json: true
  }

  msg.http.get(params).then(res => {
    let emoji = emojis[res.body.weather[0].icon.slice(0,2)];
    let temp = `${emoji} ${res.body.main.temp}\u00b0`;
    let humidty = `\ud83d\udca6 ${res.body.main.humidity}%`;
    let wind = `\ud83d\udca8 ${res.body.wind.speed} m/s`;
    cb(`${temp} ${humidty} ${wind}`)
  })
}

export default class WapetonaBot {
  constructor(app) {
    this.app = app
    this.name = "WapetonaBot";
  }

  onMessage(msg){

    if (msg.location){
      weather(msg, toLatLon(msg.location), text => msg.send(text))
    }

    msg.hear(/(\W|^)(holi)(\W|$)/i, match =>
      msg.send(msg.sample(["Holii!!", "Holi", "Holi", "Morning!"]))
    )

    msg.command("cat", match => {
      let caturl = 'http://thecatapi.com/api/images/get?format=src'
      msg.http.get(caturl).then( res => msg.send(res.headers.location) )

    msg.command("location", match => {
      let params = {
        uri: 'http://nominatim.openstreetmap.org/search',
        qs: {
          format: 'json',
          addressdetails: 1,
          q: match[0]
        }
      }
      msg.http.get(params).then( res => {
        msg.map(JSON.parse(res.body).slice(0, 3), place => {
          msg.sendLocation(place)
          msg.send(place.display_name)
          weather(msg, toLatLon(place), text => msg.send(text))
        })
      })
    })
  }
}
