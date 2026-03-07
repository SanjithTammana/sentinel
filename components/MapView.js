'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function MapView({ userLocation, alerts }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [userLocation?.lng || -97.7431, userLocation?.lat || 30.2672], // Default Austin
      zoom: 9
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add user marker
    if (userLocation) {
      new mapboxgl.Marker({ color: '#4f46e5' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<h4>Your Location</h4>'))
        .addTo(map.current);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!map.current || !alerts) return;

    // Add markers for hazards
    alerts.forEach(alert => {
      if (alert.location) {
        new mapboxgl.Marker({ color: alert.severity === 'High' || alert.severity === 'Critical' ? '#ef4444' : '#f59e0b' })
          .setLngLat([alert.location.lng, alert.location.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<b>${alert.type} Alert:</b> ${alert.title}`))
          .addTo(map.current);
      }
    });
  }, [alerts]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-200">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
