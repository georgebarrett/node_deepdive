/* eslint-disabled */

console.log('client says hi');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdlYmFycmV0dDg3OSIsImEiOiJjbHd0OTI2Y3MwMWFjMmxzZ2x0cnl5eTZjIn0.RYXyzymRdX6EHEFH-LlnIw'
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9'
    })

// console.log('client says hi');
// document.addEventListener('DOMContentLoaded', () => {
//     const mapElement = document.getElementById('map');
//     if (mapElement) {
//         console.log('Map element found');
//         const locationsData = mapElement.dataset.locations;
//         if (locationsData) {
//             const locations = JSON.parse(locationsData);

//             // Ensure Mapbox GL JS library is loaded
//             if (typeof mapboxgl !== 'undefined') {
//                 console.log('Mapbox GL JS library is loaded.');
//                 mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdlYmFycmV0dDg3OSIsImEiOiJjbHd0OTI2Y3MwMWFjMmxzZ2x0cnl5eTZjIn0.RYXyzymRdX6EHEFH-LlnIw';
//                 const map = new mapboxgl.Map({
//                     container: 'map',
//                     style: 'mapbox://styles/mapbox/streets-v9'
//                 });

//                 locations.forEach(location => {
//                     new mapboxgl.Marker()
//                         .setLngLat(location.coordinates)
//                         .addTo(map);
//                 });
//             } else {
//                 console.error('Mapbox GL JS library is not loaded.');
//             }
//         } else {
//             console.error('No locations data found on the map element.');
//         }
//     } else {
//         console.error('Map element not found.');
//     }
// });
