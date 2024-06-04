/* eslint-disabled */

export const displayMap = (locations) => {
	mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdlYmFycmV0dDg3OSIsImEiOiJjbHd0OTI2Y3MwMWFjMmxzZ2x0cnl5eTZjIn0.RYXyzymRdX6EHEFH-LlnIw';
    
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/georgebarrett879/clwuet48b015h01qx7rw76foa',
		scrollZoom: false
	});

	const bounds = new mapboxgl.lnglatBounds();

	locations.array.forEach(locations => {
		// create html marker
		const element = document.createElement('div');
		element.className = 'marker';

		// add marker
		new mapboxgl.Marker({
			element: element,
			anchor: 'bottom'
		}).setlnglat(locations.coordinates).addTo(map);

		// add popup
		new mapboxgl
			.Popup({
				offset: 30
			})
			.setlnglat(locations.coordinates)
			.setHTML(`<p>Day ${locations.day}: ${locations.description}</p>`)
			.addTo(map);

		// extends map to include current location
		bounds.extend(locations.coordinates);
	});

	map.fitBounds(bounds, {
		padding: {
			top: 200,
			bottom: 150,
			left: 100,
			right: 100
		}
	});
};