import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// ── Countries ──────────────────────────────────────────────
export async function getCountries() {
  try {
    const q = query(collection(db, 'countries'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getCountries error:', err);
    throw err;
  }
}

// ── Universities ────────────────────────────────────────────
export async function getUniversitiesByCountry(countryId) {
  try {
    const q = query(
      collection(db, 'universities'),
      where('countryId', '==', countryId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getUniversitiesByCountry error:', err);
    throw err;
  }
}

export async function getUniversityBySlug(slug) {
  try {
    const q = query(collection(db, 'universities'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() };
  } catch (err) {
    console.error('getUniversityBySlug error:', err);
    throw err;
  }
}

export async function getAllUniversities() {
  try {
    const q = query(collection(db, 'universities'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getAllUniversities error:', err);
    throw err;
  }
}

// ── Team ─────────────────────────────────────────────────────
export async function getTeam() {
  try {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getTeam error:', err);
    throw err;
  }
}

// ── Reviews ───────────────────────────────────────────────────
export async function getReviews() {
  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getReviews error:', err);
    throw err;
  }
}

export async function addReview(reviewData) {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error('addReview error:', err);
    throw err;
  }
}

// ── Observership ──────────────────────────────────────────────
export async function getObservership() {
  try {
    const q = query(collection(db, 'observership'), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() };
  } catch (err) {
    console.error('getObservership error:', err);
    throw err;
  }
}
