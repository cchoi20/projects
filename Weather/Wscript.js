const apiKey = '54500096dc0f4839bcb170952232306';

// Reset values when page is loaded
window.addEventListener('load', function() {
  const locationInput = document.getElementById('location-input');
  const checkbox1 = document.getElementById('checkbox1');
  const checkbox2 = document.getElementById('checkbox2');
  const checkbox3 = document.getElementById('checkbox3');
  //const checkbox4 = document.getElementById('checkbox4');
  locationInput.value = '';
  checkbox1.checked = false;
  checkbox2.checked = false;
  checkbox3.checked = false;
  //checkbox4.checked = false;
});


// Add button to add more weather containers to the list
const addButton = document.getElementById('add-button');
addButton.addEventListener('click', addWeatherContainer);

// EL for an 'x' button to remove containers
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-button')) {
        event.target.parentNode.remove();
    }
});

//const checkboxForecast = document.getElementById('checkbox4');
let isCheckbox1Checked = false;
let isCheckbox2Checked = false;
let isCheckbox3Checked = false;
//let isCheckbox4Checked = false;
checkbox1.addEventListener('change', function() {
  isCheckbox1Checked = checkbox1.checked;
});
checkbox2.addEventListener('change', function() {
  isCheckbox2Checked = checkbox2.checked;
});
checkbox3.addEventListener('change', function() {
  isCheckbox3Checked = checkbox3.checked;
});
/*checkbox4.addEventListener('change', function() {
  isCheckbox4Checked = checkbox4.checked;
});
*/

// Search if user presses enter on search bar
const locationInput = document.getElementById('location-input');
locationInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addWeatherContainer();
    }
});

function addWeatherContainer() {
    // Get the location from user input
    //const locationInput = document.getElementById('location-input');
    const location = locationInput.value;

    // Create display container
    const Maincontainer = document.createElement('div');
    Maincontainer.className = 'main-container';

    // Create Basic Weather stats container                                                 BASIC WEATHER
    const Wcontainer = document.createElement('div');
    Wcontainer.className = 'weather-container';

    // Set text formatting
    const localtimeElement = document.createElement('h3');
    const locationElement = document.createElement('h2');
    const countryElement = document.createElement('h3');
    const temperatureElement = document.createElement('p');
    const feelslikeElement = document.createElement('p');   // What temp the weather feels like

    const descriptionContainer = document.createElement('div'); // Container for description and image
    const descriptionElement = document.createElement('h3');
    const imageElement = document.createElement('img');

    // Set class names for formatting purposes in the CSS file
    descriptionContainer.className = 'description-container';
    descriptionElement.className = 'description-element';
    imageElement.className = 'image-element';
    
    // Description container for formatting of weather and its image
    descriptionContainer.appendChild(descriptionElement);
    descriptionContainer.appendChild(imageElement);

    // Append elements to display container
    Wcontainer.appendChild(localtimeElement);
    Wcontainer.appendChild(locationElement);
    Wcontainer.appendChild(countryElement);
    Wcontainer.appendChild(temperatureElement);
    Wcontainer.appendChild(feelslikeElement);
    Wcontainer.appendChild(descriptionContainer);


    // Create another container for WIND and GUST statistics                        WIND & GUST
    const WGcontainer = document.createElement('div');
    WGcontainer.className = 'wind-gust-container';
    WGcontainer.style.borderLeft = '1px solid #ccc'; // Border for aesthetics

    // Set text formatting for WG container
    const WGheader = document.createElement('h2');
    WGheader.textContent = 'Wind & Gust';
    const windspeedElement = document.createElement('p');
    const winddescElement = document.createElement('p');
    const winddirectionElement = document.createElement('p');
    const gustspeedElement = document.createElement('p');

    // Append elements to WG container
    WGcontainer.appendChild(WGheader);
    WGcontainer.appendChild(winddescElement);
    WGcontainer.appendChild(windspeedElement);
    WGcontainer.appendChild(winddirectionElement);
    WGcontainer.appendChild(gustspeedElement);
    

    // Create another container for AIR QUALITY statistics                              AIR QUALITY
    const AQcontainer = document.createElement('div');
    AQcontainer.className = 'air-quality-container';
    AQcontainer.style.borderLeft = '1px solid #ccc';

    const AQheader = document.createElement('h2');
    AQheader.textContent = 'Air Quality';
    const aqtableElement = document.createElement('table');

    // Append to AQ container
    AQcontainer.appendChild(AQheader);
    AQcontainer.appendChild(aqtableElement);


    // Create another container for VISIBILITY statistics                           VISIBILITY
    const Vcontainer = document.createElement('div');
    Vcontainer.className = 'visibility-container';
    Vcontainer.style.borderLeft = '1px solid #ccc';

    const Vheader = document.createElement('h2');
    Vheader.textContent = 'Visibility';
    const visibilityElement = document.createElement('p');
    const cloudElement = document.createElement('p');
    const humidityElement = document.createElement('p');
    const uvElement = document.createElement('p');
    uvElement.style.whiteSpace = "pre";                 // Line breaks for UV details
    const precipElement = document.createElement('p');
    const pressureElement = document.createElement('p');

    Vcontainer.appendChild(Vheader);
    Vcontainer.appendChild(visibilityElement);
    Vcontainer.appendChild(cloudElement);
    Vcontainer.appendChild(humidityElement);
    Vcontainer.appendChild(uvElement);
    Vcontainer.appendChild(precipElement);
    Vcontainer.appendChild(pressureElement);


    // Create X button for user removal of containers                               X Button
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'x';
    Maincontainer.appendChild(removeButton);

    // Put container after the add button                                           ADD MAIN CONTAINER
    addButton.insertAdjacentElement('afterend', Maincontainer);

    // Update api Url
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .then(data => {
            // Regular weather stats
            const location = data.location.name;
            const region = data.location.region;
            const country = data.location.country;
            const celc = data.current.temp_c;
            const fahr = data.current.temp_f;
            const flCelc = data.current.feelslike_c;
            const flFahr = data.current.feelslike_f;
            const localT = data.location.localtime;
            const description = data.current.condition.text;
            const iconUrl = `https:${data.current.condition.icon}`;

            // Get day from date
            const date = new Date(localT.slice(0,10));
            const day = date.toLocaleString('en-US', { weekday: 'long' });

            locationElement.textContent = `${location}, ${region}`;
            countryElement.textContent = `${country}`;
            temperatureElement.innerHTML = `<strong>Temperature:</strong> ${celc}°C, ${fahr}°F`;        // Make sure using ` not '
            feelslikeElement.innerHTML = `<strong>Feels like:</strong> ${flCelc}°C, ${flFahr}°F`;
            localtimeElement.innerHTML = `${day}, ${localT.slice(5, 7)}/${localT.slice(8, 10)} ${localT.slice(11, 16)}`;
            descriptionElement.textContent = description;
            imageElement.src = iconUrl;

            Maincontainer.appendChild(Wcontainer);

            // Wind & Gust stats
            if(isCheckbox1Checked){
                Maincontainer.appendChild(WGcontainer);

                const windMPH = data.current.wind_mph;
                const windKPH = data.current.wind_kph;
                const windDegree = data.current.wind_degree;
                const windDirection = data.current.wind_dir;
                const gustMPH = data.current.gust_mph;
                const gustKPH = data.current.gust_kph;

                // Determine description based on speed
                const windNum = parseFloat(windMPH);
                if(windNum <= 1) winddescElement.innerHTML = `<strong>BF: 0,</strong> Calm`;
                else if(windNum <= 3) winddescElement.innerHTML = `<strong>BF: 1,</strong> Light air`;
                else if(windNum <= 7) winddescElement.innerHTML = `<strong>BF: 2,</strong> Light breeze`;
                else if(windNum <= 12) winddescElement.innerHTML = `<strong>BF: 3,</strong> Gentle breeze`;
                else if(windNum <= 18) winddescElement.innerHTML = `<strong>BF: 4,</strong> Moderate breeze`;
                else if(windNum <= 24) winddescElement.innerHTML = `<strong>BF: 5,</strong> Fresh breeze`;
                else if(windNum <= 31) winddescElement.innerHTML = `<strong>BF: 6,</strong> Strong breeze`;
                else if(windNum <= 38) winddescElement.innerHTML = `<strong>BF: 7,</strong> Moderate gale`;
                else if(windNum <= 46) winddescElement.innerHTML = `<strong>BF: 8,</strong> Fresh gale`;
                else if(windNum <= 54) winddescElement.innerHTML = `<strong>BF: 9,</strong> Strong gale`;
                else if(windNum <= 63) winddescElement.innerHTML = `<strong>BF: 10,</strong> Whole gale`;
                else if(windNum <= 72) winddescElement.innerHTML = `<strong>BF: 11,</strong> Violent storm`;
                else if(windNum >= 73) winddescElement.innerHTML = `<strong>BF: 12,</strong> Hurricane`;

                windspeedElement.innerHTML = `<strong>Wind Speed:</strong> ${windMPH} mph, ${windKPH} kph`;
                // Wind description done above
                winddirectionElement.innerHTML = `<strong>Wind Direction:</strong> ${windDirection}, ${windDegree}°`;
                gustspeedElement.innerHTML = `<strong>Gust Speed:</strong> ${gustMPH}mph, ${gustKPH}kph`;
            }
            
            // Air quality stats
            if(isCheckbox2Checked){
                Maincontainer.appendChild(AQcontainer);

                const airqual = data.current.air_quality;
                
                for (const key in airqual) {
                    const value = airqual[key];
                    
                    const row = document.createElement('tr');
                    const keyCell = document.createElement('td');
                    const valueCell = document.createElement('td');

                    if(key === 'co'){
                        keyCell.innerHTML = `<strong>Carbon Monoxide (μg/m3): </strong>`;
                        valueCell.textContent = value.toFixed(2);
                    }
                    else if(key === 'no2'){
                        keyCell.innerHTML = `<strong>Nitrogen Dioxide (μg/m3): </strong>`;
                        valueCell.textContent = value.toFixed(2);
                    }
                    else if(key === 'o3'){
                        keyCell.innerHTML = `<strong>Ozone (μg/m3): </strong>`;
                        valueCell.textContent = value.toFixed(2);
                    }
                    else if(key === 'so2'){
                        keyCell.innerHTML = `<strong>Sulphur Dioxide (μg/m3): </strong>`;
                        valueCell.textContent = value.toFixed(2);
                    }
                    else if(key === 'pm2_5'){
                        keyCell.innerHTML = `<strong>PM2.5: </strong>`;
                        valueCell.textContent = value.toFixed(2);
                    }
                    else if(key === 'pm10'){
                        keyCell.innerHTML = `<strong>PM10: </strong>`;
                        valueCell.textContent = value.toFixed(2);
                    }
                    else if(key === 'us-epa-index'){
                        keyCell.innerHTML = `<strong>US EPA Index: </strong>`;
                        if(value === 1) valueCell.textContent = `1, Good`;
                        else if(value === 2) valueCell.textContent = `2, Moderate`;
                        else if(value === 3) valueCell.textContent = `3, Unhealthy for Sensitive Groups`;
                        else if(value === 4) valueCell.textContent = `4, Unhealthy`;
                        else if(value === 5) valueCell.textContent = `5, Very Unhealthy`;
                        else if(value === 6) valueCell.textContent = `6, Hazardous`;
                    }
                    else if(key === 'gb-defra-index'){
                        keyCell.innerHTML = `<strong>UK Defra Index: </strong>`;
                        if(value <= 3) valueCell.textContent = `${value}, Low`;
                        else if(value <= 6) valueCell.textContent = `${value}, Moderate`;
                        else if(value <= 9) valueCell.textContent = `${value}, High`;
                        else if(value >= 10) valueCell.textContent = `${value}, Very High`;
                    }
                  
                    row.appendChild(keyCell);
                    row.appendChild(valueCell);
                    aqtableElement.appendChild(row);
                }
            }
            if(isCheckbox3Checked){
                Maincontainer.appendChild(Vcontainer);

                const precMM = data.current.precip_mm;
                const precIN = data.current.precip_in;
                const humidityData = data.current.humidity;
                const cloudData = data.current.cloud;
                const visKM = data.current.vis_km;
                const visM = data.current.vis_miles;
                const uvData = data.current.uv;
                const pressureMB = data.current.pressure_mb;
                const pressureIN = data.current.pressure_in;

                // Set message according to UV index
                const uvNum = parseFloat(uvData);
                if(uvNum <= 2) uvElement.innerHTML = `<strong>Ultraviolet: ${uvData}, Minimal.</strong> \nApply SPF 15.`;
                else if(uvNum <= 4) uvElement.innerHTML = `<strong>Ultraviolet: ${uvData}, Low.</strong> \nApply SPF 15+ and \nWear Protective Clothing/Hat. `;
                else if(uvNum <= 6) uvElement.innerHTML = `<strong>Ultraviolet: ${uvData}, Moderate.</strong> \nApply SPF 30+ and \nWear Protective Clothing/Hat \nand Sunglasses. `;
                else if(uvNum <= 9) uvElement.innerHTML = `<strong>Ultraviolet: ${uvData}, High.</strong> \nApply SPF 50 and \nWear Protective Clothing/Hat \nand Sunglasses. Seek Shade. `;
                else if(uvNum >= 10)uvElement.innerHTML = `<strong>Ultraviolet: ${uvData}, Very High.</strong> \nApply SPF 50+ and \nWear Protective Clothing/Hat \nand Sunglasses. Avoid the Sun \nfrom 10AM-4PM. `;

                // Set rest of elements' messages
                visibilityElement.innerHTML = `<strong>Visibility:</strong> ${visKM} kilometers, ${visM} miles`;
                cloudElement.innerHTML = `<strong>Clouds:</strong> ${cloudData}% of the sky`;
                humidityElement.innerHTML = `<strong>Humidity:</strong> ${humidityData}%`;
                precipElement.innerHTML = `<strong>Precipitation:</strong> ${precMM} mm, ${precIN} in`;
                pressureElement.innerHTML = `<strong>Pressure:</strong> ${pressureMB} mb, ${pressureIN} in`;

            }
        })
        .catch(error => {
            console.error('Error:', error);
            locationElement.textContent = 'Invalid location';
            temperatureElement.textContent = '';
            feelslikeElement.textContent = '';
            localtimeElement.textContent = '';
            descriptionElement.textContent = 'Please enter a valid location.';
        });
}
