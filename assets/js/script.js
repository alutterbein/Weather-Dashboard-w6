var APIKey = "36726c2cbd5ebcfdb234d939b060a4a8";
let city;
const queryURL = api.openweathermap.com/data/2.5/forecast?q={city}&appid={APIKey};

fetch(queryURL)
