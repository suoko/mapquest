// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var apiURL = 'https://developer.mozilla.org/search.json?q=';
  var errorMsg = document.getElementById('error');
  var searchInput = document.getElementById('term');
  var results = document.getElementById('results');
  var request = null;
  var translate = navigator.mozL10n.get;
  var form = document.querySelector('form');

  // Forms will take the values in the input fields they contain
  // and send them to a server for further processing,
  // but since we want to stay in this page AND make a request to another server,
  // we will listen to the 'submit' event, and prevent the form from doing what
  // it would usually do, using preventDefault.
  // Read more about it here:
  // https://developer.mozilla.org/Web/API/event.preventDefault
  //
  // Then we search without leaving this page, just as we wanted.
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      search();
  }, false);

  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(search);

  // ---

  function search() {

    // Are we searching already? Then stop that search
    if(request && request.abort) {
      request.abort();
    }


    results.textContent = translate('searching');

    // We will be using the 'hidden' attribute throughout the app rather than a
    // 'hidden' CSS class because it enhances accessibility.
    // See: http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#the-hidden-attribute
    results.hidden = false;
    errorMsg.hidden = true;


    var term = searchInput.value;
    if(term.length === 0) {
      term = searchInput.placeholder;
    }

    var url = apiURL + term;

    // If you don't set the mozSystem option, you'll get CORS errors (Cross Origin Resource Sharing)
    // You can read more about CORS here: https://developer.mozilla.org/docs/HTTP/Access_control_CORS
    request = new XMLHttpRequest({ mozSystem: true });

    request.open('get', url, true);
    request.responseType = 'json';

    // We're setting some handlers here for dealing with both error and
    // data received. We could just declare the functions here, but they are in
    // separate functions so that search() is shorter, and more readable.
    request.addEventListener('error', onRequestError);
    request.addEventListener('load', onRequestLoad);

    request.send();

  }


  function onRequestError() {

    var errorMessage = request.error;
      if(!errorMessage) {
        errorMessage = translate('searching_error');
      }
      showError(errorMessage);

  }


  function onRequestLoad() {

    var response = request.response;

    if(response === null) {
      showError(translate('searching_error'));
      return;
    }

    results.textContent = '';

    var documents = response.documents;

    if(documents.length === 0) {

      var p = document.createElement('p');
      p.textContent = translate('search_no_results');
      results.appendChild(p);

    } else {

      documents.forEach(function(doc) {

        // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
        // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations
        var docLink = document.createElement('a');
        docLink.textContent = doc.title;
        docLink.href = doc.url;

        // We want the links to open in a pop up window with a 'close'
        // button, so that the user can consult the result and then close it and
        // be brought back to our app.
        // If we did nothing, these external links would take over the entirety
        // our app and there would be no way for a user to go back to the app.
        // But Firefox OS allows us to open ONE new window per app; these new
        // windows will have a close button, so the user can close the overlay
        // when they're happy with what they've read.
        // Therefore we will capture click events on links, stop them from
        // doing their usual thing using preventDefault(),
        // and then open the link but in a new window.
        docLink.addEventListener('click', function(evt) {
          evt.preventDefault();
          window.open(evt.target.href, 'overlay');
        });

        var h2 = document.createElement('h2');
        h2.appendChild(docLink);
        results.appendChild(h2);

      });

    }

    // And once we have all the content in place, we can show it.
    results.hidden = false;

  }


  function showError(text) {
    errorMsg.textContent = text;
    errorMsg.hidden = false;
    results.hidden = true;
  }

  
 

// GEOLOCATION

var geolocation = document.querySelector("#geolocation"),
geolocationDisplay = document.querySelector("#geolocation-display");
if (geolocation && geolocationDisplay) {
geolocation.onclick = function () {
navigator.geolocation.getCurrentPosition(function (position) {
geolocationDisplay.innerHTML = "<strong>Latitude:</strong> " + position.coords.latitude + ", <strong>Longitude:</strong> " + position.coords.longitude;
geolocationDisplay.style.display = "block";

// GOOGLE IMG
   /*var img = new Image();
    img.src = "http://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=13&size=300x300&sensor=false";
    geolocationDisplay.appendChild(img);*/
// fine aggiunti da me

  
/*
//  MAPQUEST
 var options={
          elt:document.getElementById('map'),        
          zoom:13,                                   
          latLng:{lat:43.0059, lng:12.6000},   
          mtype:'osm'  
	  };

	      window.map = new MQA.TileMap(options);
        MQA.withModule('directions', function() {

          map.addRoute([
            {latLng: {lat:position.coords.latitude, lng:position.coords.longitude}},
            {latLng: {lat:43.0059, lng:12.6000}}
          ]);
        });
	
  
*/
//  SKOBBLER
    var map = L.skobbler.map('map', {
        apiKey: 'bc7b4da77e971c12cb0e069bffcf2771',

        mapStyle: 'day',
        bicycleLanes: true,
        onewayArrows: true,
        pois: 'all',
        primaryLanguage: 'en',
        fallbackLanguage: 'en',
        mapLabels: 'localNaming',
        retinaDisplay: 'auto',

        zoomControl: true,
        zoomControlPosition: 'top-left',

        center: [position.coords.latitude, position.coords.longitude],
        zoom: 12,
        transport: 'pedestrian',
				start:  [position.coords.latitude, position.coords.longitude],
				nonReachable: 1,
				range: 200,
				units: 'Meter',
				response_type: 'gps',
      
        startCoordinate: [position.coords.latitude, position.coords.longitude],
        destinationCoordinate: [43.0059, 12.6000]
      
      
    }); 
	 var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
   marker.bindPopup("This is where you are. And this is the area where you can get in 5 minutes by walking.", { offset: new L.Point(-1, -41) }).openPopup();

  
  
},
function () {
geolocationDisplay.innerHTML = "Failed to get your current location";
geolocationDisplay.style.display = "block";
});
};
}

                        



  
});
