import express, { json } from "express";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const WeatherAPIKey = "613060d875f013f0fce718aa13df8ec6";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/getInfo", async (req, res) => {
    let lat, lng;
    try {
        const result = await axios.get("http://api.openweathermap.org/geo/1.0/direct", {
            params: {
                q: req.body.locationInput,
                appid: WeatherAPIKey,
              },
        })
        lat = result.data[0].lat;
        lng = result.data[0].lon;
        console.log(`location: ${req.body.locationInput}`);
        console.log(`Latitude: ${lat}`);
        console.log(`Longitude: ${lng}`);

        try {
            const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
                params: {
                    lat: lat,
                    lon: lng,
                    appid: WeatherAPIKey,
                    units: "metric",
                },
            })
            const temp = response.data.list[0].main.temp;
            console.log(`temp: ${temp}`);
            console.log("Feels like", response.data.list[0].main.feels_like);
            const currentTime = new Date(); // Get the current date and time
            const formattedDate = currentTime.toLocaleDateString();
          
            res.render("weatherInfo.ejs", { data: response.data, location: req.body.locationInput, date: formattedDate});
        } catch (error) {
            console.log(error.message);
        }
        
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 