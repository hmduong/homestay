import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';

const MapBox = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAP_TOKEN,
});

const Map = ({ coor, onChange, defaultCoor = null }) => {
    const [mapMarker, setMapMarker] = useState(coor);

    const initialViewState = {
        longitude: coor.lng,
        latitude: coor.lat,
        zoom: coor.zoom || [13],
    };
    return (
        <div className="the-map">
            <MapBox
                {...initialViewState}
                style="mapbox://styles/mapbox/streets-v9"
                initialViewState={initialViewState}
                center={[coor.lng, coor.lat]}
                containerStyle={{
                    height: '100%',
                    width: '100%',
                }}
                onMove={(evt) => {
                    setMapMarker({ lng: evt.transform._center.lng, lat: evt.transform._center.lat, zoom: [evt.transform._zoom] })
                    onChange({
                        lng: evt.transform._center.lng,
                        lat: evt.transform._center.lat,
                        zoom: [evt.transform._zoom],
                    })
                }
                }
            >
                <Marker
                    coordinates={defaultCoor ? [defaultCoor.lng, defaultCoor.lat] : [mapMarker.lng, mapMarker.lat]}
                    anchor="bottom"
                >
                    <img className='the-map-marker' src={require('assets/img/theme/marker_map_icon.png')} />
                </Marker>
            </MapBox>
        </div>
    );
};

export default Map;