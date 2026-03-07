/**
 * Fetches active alerts from the National Weather Service (NWS)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
export async function fetchNWSAlerts(lat, lon) {
  const roundedLat = Number(lat).toFixed(4);
  const roundedLon = Number(lon).toFixed(4);
  const url = `https://api.weather.gov/alerts/active?point=${roundedLat},${roundedLon}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': '(sentinel-app.com, team@sentinel.com)'
      }
    });
    
    if (!response.ok) {
      console.error('NWS API error:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Error fetching NWS alerts:', error);
    return [];
  }
}

/**
 * Fetches recent earthquakes from the USGS
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Radius in km (default 200)
 */
export async function fetchUSGSQuakes(lat, lon, radius = 200) {
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=${radius}&minmagnitude=2.5&orderby=time&limit=10`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('USGS API error:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Error fetching USGS quakes:', error);
    return [];
  }
}

/**
 * Computes a bounding box from center coordinates and radius in km
 * @param {number} lat - Center latitude
 * @param {number} lon - Center longitude
 * @param {number} radiusKm - Radius in km
 * @returns {Array<number>} [west, south, east, north]
 */
function getBoundingBox(lat, lon, radiusKm) {
  const kmPerLat = 111;
  const kmPerLon = 111 * Math.cos(lat * Math.PI / 180);
  
  const dLat = radiusKm / kmPerLat;
  const dLon = radiusKm / kmPerLon;
  
  return [
    (lon - dLon).toFixed(2),
    (lat - dLat).toFixed(2),
    (lon + dLon).toFixed(2),
    (lat + dLat).toFixed(2)
  ];
}

/**
 * Fetches wildfire data from NASA FIRMS
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radiusKm - Radius in km (default 30)
 */
export async function fetchNASAFirms(lat, lon, radiusKm = 30) {
  const mapKey = process.env.NASA_FIRMS_MAP_KEY;
  if (!mapKey) {
    console.warn('NASA_FIRMS_MAP_KEY not set');
    return [];
  }
  
  const [w, s, e, n] = getBoundingBox(lat, lon, radiusKm);
  const source = 'VIIRS_SNPP_NRT';
  const dayRange = 1;
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${w},${s},${e},${n}/${dayRange}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('NASA FIRMS API error:', response.statusText);
      return [];
    }
    
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching NASA FIRMS:', error);
    return [];
  }
}

/**
 * Simplistic CSV parser for FIRMS output
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
}
