import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getDb } from '@/lib/firebase-admin';

const PROFILES = 'profiles';
const ALERTS = 'alerts';
const CHAT_FEEDBACK = 'chat_feedback';

export const DEMO_USER_ID = '8732a39a-7622-4a0b-932b-3443a29777f9';

function serializeValue(value) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializeValue(v)]));
  }

  return value;
}

function mapDoc(docSnap) {
  return { id: docSnap.id, ...serializeValue(docSnap.data()) };
}

export async function ensureDemoProfile() {
  const db = getDb();
  const ref = db.collection(PROFILES).doc(DEMO_USER_ID);
  const existing = await ref.get();

  if (!existing.exists) {
    await ref.set({
      email: 'demo@sentinel.local',
      latitude: 30.2672,
      longitude: -97.7431,
      cityName: 'Austin, TX',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastCheckedAt: null,
    });
  }
}

export async function getProfiles() {
  const db = getDb();
  const snapshot = await db.collection(PROFILES).get();
  return snapshot.docs.map(mapDoc);
}

export async function setProfileLastChecked(userId) {
  const db = getDb();
  await db.collection(PROFILES).doc(userId).set(
    {
      lastCheckedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

function alertDocId(userId, hazardId) {
  return `${userId}_${hazardId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 140);
}

export async function insertAlertIfNew(userId, hazardId, alertPayload) {
  const db = getDb();
  const docId = alertDocId(userId, hazardId);
  const ref = db.collection(ALERTS).doc(docId);
  const existing = await ref.get();

  if (existing.exists) {
    return false;
  }

  await ref.set({
    userId,
    hazardId,
    createdAt: FieldValue.serverTimestamp(),
    ...alertPayload,
  });

  return true;
}

export async function getAlertsByUserId(userId) {
  const db = getDb();
  const snapshot = await db.collection(ALERTS).where('userId', '==', userId).get();

  return snapshot.docs
    .map(mapDoc)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function insertChatFeedback({ userId, model, firstOutputSummary, context = {} }) {
  const db = getDb();
  await db.collection(CHAT_FEEDBACK).add({
    userId,
    model,
    firstOutputSummary,
    context,
    createdAt: FieldValue.serverTimestamp(),
  });
}
