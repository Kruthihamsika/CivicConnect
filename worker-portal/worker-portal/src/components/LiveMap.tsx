import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

const complaintIcon =
  new L.Icon({
    iconUrl:
      'https://cdn-icons-png.flaticon.com/512/684/684908.png',

    iconSize: [35, 35],
  });

const workerIcon =
  new L.Icon({
    iconUrl:
      'https://cdn-icons-png.flaticon.com/512/149/149071.png',

    iconSize: [35, 35],
  });

interface Props {
  complaints: any[];
  workers: any[];
  clusters: any[];
}

export default function LiveMap({
  complaints,
  workers,
  clusters,
}: Props) {
  return (
    <div
      style={{
        height: '80vh',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={[
          17.385,
          78.4867,
        ]}
        zoom={11}
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {/* CLUSTERS */}

        {clusters.map(
          (cluster) => (
            <Circle
              key={cluster.id}
              center={[
                cluster.center_latitude,
                cluster.center_longitude,
              ]}
              radius={
                cluster.radius_km *
                1000
              }
              pathOptions={{
                color: '#8b5cf6',
                fillColor:
                  '#8b5cf6',
                fillOpacity: 0.2,
              }}
            />
          )
        )}

        {/* COMPLAINTS */}

        {complaints.map(
          (complaint) => (
            <Marker
              key={
                complaint.id
              }
              position={[
                complaint.latitude,
                complaint.longitude,
              ]}
              icon={
                complaintIcon
              }
            >
              <Popup>
                <strong>
                  {
                    complaint.title
                  }
                </strong>

                <br />

                {
                  complaint.status
                }
              </Popup>
            </Marker>
          )
        )}

        {/* WORKERS */}

        {workers.map(
          (worker) => (
            <Marker
              key={worker.id}
              position={[
                worker.latitude,
                worker.longitude,
              ]}
              icon={
                workerIcon
              }
            >
              <Popup>
                <strong>
                  {
                    worker.name
                  }
                </strong>

                <br />

                {
                  worker.status
                }
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
}