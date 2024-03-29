/*
 * @license
 */
'use strict';

const thisApp = {
  selectedLocations: {},
  addDialogContainer: document.getElementById('addDialogContainer'),
	modalConfig: document.getElementById('modalConfig'),
	statusLabel: document.getElementById('status-text'),
	serverIp: "192.168.0.1"
};


/**
 * Toggles the visibility of the add location dialog box.
 */
function toggleAddDialog() {
  thisApp.addDialogContainer.classList.toggle('visible');
}

/**
 * Event handler for butDialogAdd, adds the selected location to the list.
 */
function addLocation() {
  // Hide the dialog
  toggleAddDialog();
  // Get the selected city
  const select = document.getElementById('selectCityToAdd');
  const selected = select.options[select.selectedIndex];
  const geo = selected.value;
  const label = selected.textContent;
  const location = {label: label, geo: geo};
  // Create a new card & get the weather data from the server
  const card = getForecastCard(location);
  getForecastFromNetwork(geo).then((forecast) => {
    renderForecast(card, forecast);
  });
  // Save the updated list of selected cities.
  thisApp.selectedLocations[geo] = location;
  saveLocationList(thisApp.selectedLocations);
}

/**
 * Event handler for .remove-city, removes a location from the list.
 *
 * @param {Event} evt
 */
function removeLocation(evt) {
  const parent = evt.srcElement.parentElement;
  parent.setAttribute('hidden', true);
  if (thisApp.selectedLocations[parent.id]) {
    delete thisApp.selectedLocations[parent.id];
    saveLocationList(thisApp.selectedLocations);
  }
}

/**
 * Renders the forecast data into the card element.
 *
 * @param {Element} card The card element to update.
 * @param {Object} data Weather forecast data to update the element with.
 */
function renderForecast(card, data) {

  if (!data) {
    // There's no data, skip the update.
    console.log("Render skipped!")
    return;
  }

  // Find out when the element was last updated.
  const cardLastUpdatedElem = card.querySelector('.card-last-updated');
  const cardLastUpdated = cardLastUpdatedElem.textContent;
  const lastUpdated = parseInt(cardLastUpdated);
  
  // If the data on the element is newer, skip the update.
  // if (lastUpdated >= data.currently.time) {
  if (lastUpdated >= data.dt) {
    console.log("Render skipped for time")
    return;
  }
  // cardLastUpdatedElem.textContent = data.currently.time;
  cardLastUpdatedElem.textContent = data.dt;
  
  // If the loading spinner is still visible, remove it.
  const spinner = card.querySelector('.card-spinner');
  if (spinner) {
    card.removeChild(spinner);
  }
}


/**
 * Get's the latest forecast data from the network.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromNetwork(coords) {

  var coord = coords.split(',')

  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${coord[0]}&lon=${coord[1]}&lang=it&units=metric&APPID=b82ec2f9c61a9f11fbe81ec3d5100227`
  console.log("[getForecastFromNetwork] Fetch coords = '"+coords+"' - URL: "+url)
  return null /* fetch(url)
      .then( (response) => {
        console.log("fetch .then > " + response)
        return response.json();
      })
      .catch( () => {
        console.error("fetch .catch")
        return null;
      }); */
}


/**
 * Get's the HTML element for the weather forecast, or clones the template
 * and adds it to the DOM if we're adding a new item.
 *
 * @param {Object} location Location object
 * @return {Element} The element for the weather forecast.
 */
function getForecastCard(location) {
  const id = location.geo;
  const card = document.getElementById(id);
  if (card) {
    return card;
	}
	/*
  const newCard = document.getElementById('weather-template').cloneNode(true);
  newCard.querySelector('.location').textContent = location.label;
  newCard.setAttribute('id', id);
  newCard.querySelector('.remove-city').addEventListener('click', removeLocation);
  document.querySelector('main').appendChild(newCard);
	newCard.removeAttribute('hidden');
	*/
  return newCard;
}

function openConfig()
{
  // Apre la finestra di configurazione (IP)
  console.log("Config pressed")
}


/**
 * Gets the latest weather forecast data and updates each card with the
 * new data.
 */
function updateData() {
  /*
  Object.keys(thisApp.selectedLocations).forEach((key) => {
    const location = thisApp.selectedLocations[key];
    const card = getForecastCard(location);

    // Get the forecast data from the network.
    getForecastFromNetwork(location.geo)
        .then( (forecast) => {
          renderForecast(card, forecast);
    });
  })*/
}


/**
 * Saves the list of locations.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveLocationList(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

/**
 * Loads the list of saved location.
 *
 * @return {Array}
 */
function loadLocationList() {
	// Guarda in LocalStorage se ci sono posti salvati
	/*
  let locations = localStorage.getItem('locationList');
  if (locations) {
    try {
      locations = JSON.parse(locations);
    } catch (ex) {
      locations = {};
    }
  }
  // Dati di default se non trovati altri salvataggi in localStorage
  if (!locations || Object.keys(locations).length === 0) {
    const key = '40.7720232,-73.9732319';
    locations = {};
    locations[key] = {label: 'New York City', geo: '40.7720232,-73.9732319'};
  }
	return locations;
	*/
}



/**
 * Initialize the app, imposta i listeners per i bottoni.
 */
function init() {
  console.log("init()");
  // Set up the event handlers for all of the buttons.
  document.getElementById('butRefresh').addEventListener('click', updateData);
  // Gestito da Modal document.getElementById('butConfig').addEventListener('click', openConfig);
  document.getElementById('butAdd').addEventListener('click', toggleAddDialog);
  document.getElementById('butAddEl').addEventListener('click', addProduct);

  document.getElementById('butDialogCancel').addEventListener('click', toggleAddDialog);
  document.getElementById('butDialogAdd').addEventListener('click', addLocation);

	document.getElementById('status-text').innerHTML = "Tentativo connessione .."
	document.getElementById('product-template').addEventListener('click', showAcquisto)

	// Valori iniziali salvati
	thisApp.serverIp = localStorage.getItem('serverIp')
	document.getElementById("ip").value = thisApp.serverIp
	//
	thisApp.serverPort = localStorage.getItem('serverPort')
	document.getElementById("serverPort").value = thisApp.serverPort

  thisApp.statusLabel.innerHTML = "Server IP: "+thisApp.serverIp+":"+thisApp.serverPort
}

/**
 * Imposta e salva le nuove varibili di connessione
 * @param {in} newIp Nuovo indirizzo IP
 * @param {in} newPort Nuova porta
 */
function setIp(newIp, newPort){
	console.log("server IP: "+newIp+":"+newPort)

	thisApp.serverIp = newIp
  localStorage.setItem('serverIp', newIp)

	thisApp.serverPort = newPort
  localStorage.setItem('serverPort', newPort)

	thisApp.statusLabel.innerHTML = "Server IP: "+newIp+":"+newPort
}


// Duplica il blocco di un prodotto
function addProduct() {
	const newProd = document.getElementById('product-template').cloneNode(true);
  
  var prezzo = Math.random()*20
  prezzo = prezzo.toFixed(2)
  newProd.querySelector('.costoProdotto .value').textContent = prezzo;
  newProd.querySelector('#nomeProdotto').textContent = "PRODOTTO N";
  newProd.querySelector('.idColonna').textContent = "127";
  newProd.setAttribute('id', 555);
  // newProd.querySelector('.remove-city').addEventListener('click', removeLocation);

  newProd.addEventListener('click', showAcquisto)

	//document.querySelector('#products_container').appendChild(newProd);
	document.querySelector('#row').appendChild(newProd);
	
	// newProd.removeAttribute('hidden');
}


// Entro ev ci sono i dati dell'elemento cliccato
function showAcquisto(ev){
	// Cerca i dati del prodotto
	console.log(ev.target)
	var trg = ev.target
	trg = trg.parentElement
	trg = trg.parentElement

	var elNome = trg.querySelector('#nomeProdotto')
	if (elNome==null){
		trg = trg.parentElement
		console.log(trg)
    elNome = trg.querySelector('#nomeProdotto')
	}
	console.log(elNome)

	var elPrezzo = trg.querySelector('.costoProdotto')
	if (!elPrezzo){
		trg = trg.parentElement
    elPrezzo = trg.querySelector('.costoProdotto')
	}

	var elColonna = trg.querySelector('.idColonna')

	// Riempie la modal con i dati
	var elem = document.querySelector('#modalAcquisto')
	elem.querySelector('#modalNomeProdotto').textContent = elNome.textContent
	elem.querySelector('#modalPrezzoProdotto').textContent = elPrezzo.textContent
	elem.querySelector('#modalColonnaProdotto').textContent = elColonna.textContent
	// Mostra modal
	var instance = M.Modal.getInstance(elem)
	instance.open()
}


// Partenza del tutto !
init();
