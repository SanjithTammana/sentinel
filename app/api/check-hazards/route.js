import { NextResponse } from 'next/server';
import { fetchNWSAlerts, fetchUSGSQuakes, fetchNASAFirms } from '@/lib/hazard-fetchers';
import { generateHazardAdvice } from '@/lib/ai-service';
import { ensureDemoProfile, getProfiles, insertAlertIfNew, setProfileLastChecked } from '@/lib/firestore-service';

export async function GET() {
  try {
    await ensureDemoProfile();

    const users = await getProfiles();
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users found to check.' });
    }

    const results = [];

    for (const user of users) {
      const { latitude, longitude, id: userId } = user;
      if (latitude == null || longitude == null) continue;

      const [nwsAlerts] = await Promise.all([
        fetchNWSAlerts(latitude, longitude),
        fetchUSGSQuakes(latitude, longitude, 200),
        fetchNASAFirms(latitude, longitude, 30),
      ]);

      for (const alert of nwsAlerts) {
        const hazardId = `nws-${alert.id}`;
        const advice = await generateHazardAdvice(alert.properties.event, alert.properties);

        const inserted = await insertAlertIfNew(userId, hazardId, {
          type: 'weather',
          title: alert.properties.headline || alert.properties.event,
          severity: advice.riskLevel,
          description: alert.properties.description,
          rawData: alert,
          aiAdvice: advice,
          location: { lat: latitude, lng: longitude },
        });

        if (inserted) {
          results.push({ userId, type: 'weather', hazardId });
        }
      }

      await setProfileLastChecked(userId);
    }

    return NextResponse.json({
      success: true,
      hazardsProcessed: results.length,
      details: results,
    });
  } catch (error) {
    console.error('Hazard check job failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
