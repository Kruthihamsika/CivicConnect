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

export default function LiveAdminMap({
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

        {/* SAFE CLUSTERS */}

        {clusters
          .filter(
            (cluster) =>
              cluster.center_latitude !=
                null &&
              cluster.center_longitude !=
                null
          )
          .map((cluster) => (
            <Circle
              key={cluster.id}
              center={[
                Number(
                  cluster.center_latitude
                ),
                Number(
                  cluster.center_longitude
                ),
              ]}
              radius={
                Number(
                  cluster.radius_km
                ) * 1000
              }
              pathOptions={{
                color: '#8b5cf6',
                fillColor:
                  '#8b5cf6',
                fillOpacity: 0.15,
              }}
            />
          ))}

        {/* SAFE COMPLAINTS */}

        {complaints
          .filter(
            (complaint) =>
              complaint.latitude !=
                null &&
              complaint.longitude !=
                null
          )
          .map((complaint) => (
            <Marker
              key={complaint.id}
              position={[
                Number(
                  complaint.latitude
                ),
                Number(
                  complaint.longitude
                ),
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

                Status:{' '}
                {
                  complaint.status
                }

                <br />

                Priority:{' '}
                {complaint.priority ??
                  complaint.priority_level}
              </Popup>
            </Marker>
          ))}

        {/* SAFE WORKERS */}

        {workers
          .filter(
            (worker) =>
              worker.latitude !=
                null &&
              worker.longitude !=
                null
          )
          .map((worker) => (
            <Marker
              key={worker.id}
              position={[
                Number(
                  worker.latitude
                ),
                Number(
                  worker.longitude
                ),
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

                Status:{' '}
                {
                  worker.status
                }
              </Popup>
            </Marker>
          ))}

      </MapContainer>
    </div>
  );
}