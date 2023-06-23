const apiKey = '54500096dc0f4839bcb170952232306';

// Add button to add more weather containers to the list
const addButton = document.getElementById('add-button');
addButton.addEventListener('click', addWeatherContainer);

// EL for the 'x' button to remove containers
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-button')) {
        event.target.parentNode.remove();
    }
});

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
    const container = document.createElement('div');
    container.className = 'weather-container';

    // Set text types
    const locationElement = document.createElement('h2');
    const countryElement = document.createElement('h3');
    const temperatureElement = document.createElement('p');
    const feelslikeElement = document.createElement('p');   // What temp the weather feels like
    const localtimeElement = document.createElement('p');

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
    container.appendChild(locationElement);
    container.appendChild(countryElement);
    container.appendChild(temperatureElement);
    container.appendChild(feelslikeElement);
    container.appendChild(localtimeElement);
    container.appendChild(descriptionContainer);

    // Create X button for user removal of containers
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'x';
    container.appendChild(removeButton);

    addButton.insertAdjacentElement('afterend', container);

    // Update api Url
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .then(data => {
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

            locationElement.textContent = `${location}, ${region}`;
            countryElement.textContent = `${country}`;
            temperatureElement.innerHTML = `<strong>Temperature:</strong> ${celc}°C, ${fahr}°F`;        // Make sure using ` not '
            feelslikeElement.innerHTML = `<strong>Feels like:</strong> ${flCelc}°C, ${flFahr}°F`;
            localtimeElement.innerHTML = `<strong>Local Time: </strong> ${localT.slice(5, 7)}/${localT.slice(8, 10)}, ${localT.slice(11, 16)}`;
            descriptionElement.textContent = description;
            imageElement.src = iconUrl;
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