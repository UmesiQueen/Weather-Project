const { response } = require("express");

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const apiKeys = require("./apiKeys"); 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const units = "metric";
  const apiKey = apiKeys.openWeatherMapAPIKey;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const name = weatherData.name;
      const country = weatherData.sys.country;
      const temp = weatherData.main.temp;
      const weather = weatherData.weather[0].main;
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.send(
        " <!DOCTYPE html> <html lang='en'><head><meta charset='UTF-8' />" +
          "<meta http-equiv='X-UA-Compatible' content='IE=edge' />" +
          "<meta name='viewport' content='width=device-width, initial-scale=1.0'/>" +
          "<title>Weather App</title><link rel='stylesheet' href='css/style.css' />" +
          "</head><body><main class='container'><h1>Weather App</h1><p class='query text'> " +
          name +
          " </p><div class='main'>"+
          "<img class='weatherIcon' src='" +
          imageURL +
          "' alt='Unavailable'/><ul>"+
          "<li class='text'>Country : " +
          country +
          "</li>" +
          "<li class='text'>Weather : " +
          weather +
          " </li>" +
          "<li class='text'>Weather Description : " +
          weatherDesc +
          " </li>" +
          "<li class='text'>Temperature : " +
          temp +
          " Degrees Celsius</li> " +
          "</ul></div>" +
          "</main></body></html>"
      );
    });
  });
});

app.listen( process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000.");
});
