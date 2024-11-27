// import React, { useState } from 'react';
// import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
// import axios from 'axios';

// const GoogleMapSearch = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [location, setLocation] = useState(null);
//     const [markerPosition, setMarkerPosition] = useState(null);
//     const [map, setMap] = useState(null);

//     // Google Maps API key (replace with your actual API key)
//     const googleMapsAPIKey = "YOUR_API_KEY"; // Replace with your Google Maps API key

//     // Initial center for the map (San Francisco, for example)
//     const defaultCenter = { lat: 37.7749, lng: -122.4194 };
//     const defaultZoom = 12;

//     // Handle Search Query and Location
//     const handleSearch = async () => {
//         if (!searchQuery || !location) {
//             alert('Please select a location');
//             return;
//         }

//         // Prepare data to send to backend
//         const data = {
//             query: searchQuery,
//             location: {
//                 type: 'Point',
//                 coordinates: [location.lng, location.lat],
//             },
//             // Assuming you have user authentication and can get the userId from the current session/context
//             userId: 'USER_ID', // Replace with actual user ID
//         };

//         try {
//             // Send data to backend using GET method
//             await axios.get('http://localhost:7000/api/searchhistory/savehistory', { params: data });

//             alert('Search history saved successfully!');
//         } catch (error) {
//             console.error('Error saving search history:', error);
//             alert('Error saving search history.');
//         }
//     };

//     // On map load
//     const onLoad = (mapInstance) => {
//         setMap(mapInstance);
//     };

//     // On place selection (via search box)
//     const onPlacesChanged = (searchBox) => {
//         const place = searchBox.getPlaces()[0];

//         if (place) {
//             const lat = place.geometry.location.lat();
//             const lng = place.geometry.location.lng();
//             setSearchQuery(place.name);
//             setLocation({ lat, lng });
//             setMarkerPosition({ lat, lng });

//             map.panTo(new window.google.maps.LatLng(lat, lng)); // Center the map to the selected location
//         }
//     };

//     return (
//         <LoadScript googleMapsApiKey={googleMapsAPIKey}>
//             <GoogleMap
//                 id="google-map"
//                 mapContainerStyle={{ width: '100%', height: '400px' }}
//                 center={defaultCenter}
//                 zoom={defaultZoom}
//                 onLoad={onLoad}
//             >
//                 {/* Search box for location */}
//                 <StandaloneSearchBox onLoad={onPlacesChanged}>
//                     <input
//                         type="text"
//                         placeholder="Search for a location"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         style={{
//                             position: 'absolute',
//                             top: 10,
//                             left: 10,
//                             zIndex: 5,
//                             width: '300px',
//                             padding: '8px',
//                             borderRadius: '4px',
//                             border: '1px solid #ccc',
//                         }}
//                     />
//                 </StandaloneSearchBox>

//                 {/* Marker for selected location */}
//                 {markerPosition && (
//                     <Marker position={markerPosition} />
//                 )}

//                 {/* Button to save search history */}
//                 <div style={{ position: 'absolute', top: 70, left: 10 }}>
//                     <button onClick={handleSearch} style={{ padding: '10px', fontSize: '14px', borderRadius: '4px' }}>
//                         Save Search History
//                     </button>
//                 </div>
//             </GoogleMap>
//         </LoadScript>
//     );
// };

// export default GoogleMapSearch;
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const GoogleMapSearch = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Initialize the map only once
    if (mapRef.current) return;

    // Create the map instance
    const mapInstance = L.map('map').setView([20.5937, 78.9629], 5);

    // Add tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    mapRef.current = mapInstance;

    // Add map click event to set location
    mapInstance.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });

      // Add or update the marker
      L.marker([lat, lng]).addTo(mapInstance).bindPopup('You clicked here').openPopup();
    });

    // Cleanup on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSaveSearch = () => {
    if (!location) {
      setMessage('Please click on the map to select a location.');
      return;
    }
  
    if (!query) {
      setMessage('Please enter a search query.');
      return;
    }
  
    // Prepare data to store in localStorage
    const searchData = {
      query,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],  
      },
      timestamp: new Date().toISOString(),  // Add timestamp to each search
    };
  
    // Retrieve existing search history from localStorage
    const savedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
    // Add the new search data to the search history array
    savedSearchHistory.push(searchData);
  
    // Save the updated search history back to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(savedSearchHistory));
  
    setMessage('Search history saved successfully!');
  };

  const handleSearchLocation = async () => {
    if (!query) {
      setMessage('Please enter a location to search.');
      return;
    }

    // Call Nominatim API to search for the location
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];

        // Set the map view to the found location
        mapRef.current.setView([lat, lon], 13);

        // Set location state and add marker
        setLocation({ lat, lng: lon });
        L.marker([lat, lon]).addTo(mapRef.current).bindPopup(`Location: ${query}`).openPopup();
      } else {
        setMessage('Location not found. Please try another search.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setMessage('An error occurred while searching for the location.');
    }
  };

  return (
    <div className="map-search-container">
      {/* Map container */}
      <div id="map" style={{ height: '500px', width: '1000px', marginTop: '60px' }}></div>

      {/* Search form */}
      <div className="search-form">
        <input
          type="text"
          placeholder="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearchLocation}>Search Location</button>
        <button onClick={handleSaveSearch}>Save Search</button>
      </div>

      {/* Message display */}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default GoogleMapSearch;









