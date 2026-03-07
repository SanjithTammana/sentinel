import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchNWSAlerts, fetchUSGSQuakes, fetchNASAFirms } from '@/lib/hazard-fetchers';
import { generateHazardAdvice } from '@/lib/ai-service';

export async function GET(request) {
  try {
    // 1. Get all users and their locations from Supabase
    const { data: users, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, latitude, longitude, last_checked_at');
      
    if (userError) throw userError;
    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users found to check.' });
    }

    const results = [];

    for (const user of users) {
      const { latitude, longitude, id: userId } = user;
      
      // 2. Poll APIs for each hazard type
      const [nwsAlerts, usgsQuakes, nasaFirms] = await Promise.all([
        fetchNWSAlerts(latitude, longitude),
        fetchUSGSQuakes(latitude, longitude, 200),
        fetchNASAFirms(latitude, longitude, 30)
      ]);

      // 3. Process hazards and generate AI advice
      // Example: NWS alerts
      for (const alert of nwsAlerts) {
        const hazardId = `nws-${alert.id}`;
        
        // Check if we've already processed this alert for this user
        const { data: existing } = await supabaseAdmin
          .from('alerts')
          .select('id')
          .eq('user_id', userId)
          .eq('hazard_id', hazardId)
          .single();
          
        if (!existing) {
          // New hazard! Generate advice
          const advice = await generateHazardAdvice(alert.properties.event, alert.properties);
          
          // Store alert in Supabase
          await supabaseAdmin.from('alerts').insert({
            user_id: userId,
            hazard_id: hazardId,
            type: 'weather',
            title: alert.properties.headline || alert.properties.event,
            severity: advice.riskLevel,
            description: alert.properties.description,
            raw_data: alert,
            ai_advice: advice,
            location: { lat: latitude, lng: longitude }
          });
          
          results.push({ userId, type: 'weather', hazardId });
        }
      }

      // 4. Update last checked time for user
      await supabaseAdmin
        .from('profiles')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('id', userId);
    }

    return NextResponse.json({ 
      success: true, 
      hazardsProcessed: results.length,
      details: results 
    });
    
  } catch (error) {
    console.error('Hazard check job failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
