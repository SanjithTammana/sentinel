'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function MapView({ userLocation, alerts }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [userLocation?.lng || -97.7431, userLocation?.lat || 30.2672],
      zoom: 8.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (userLocation) {
      new mapboxgl.Marker({ color: '#40ffcf' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<h4>Monitoring Center</h4>'))
        .addTo(map.current);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!map.current || !alerts) return;

    alerts.forEach((alert) => {
      if (!alert.location) return;
      const severe = alert.severity === 'High' || alert.severity === 'Critical';
      new mapboxgl.Marker({ color: severe ? '#ff6072' : '#ffc857' })
        .setLngLat([alert.location.lng, alert.location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${alert.type || 'Hazard'}:</strong> ${alert.title || 'Alert'}`))
        .addTo(map.current);
    });
  }, [alerts]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}
