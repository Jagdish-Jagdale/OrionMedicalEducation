import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
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

export async function saveTeam(members) {
  try {
    const snapshot = await getDocs(collection(db, 'team'));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    await Promise.all(
      members.map((m, i) =>
        addDoc(collection(db, 'team'), { ...m, order: i, updatedAt: serverTimestamp() })
      )
    );
  } catch (err) {
    console.error('saveTeam error:', err);
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

export async function saveReviews(reviews) {
  try {
    const snapshot = await getDocs(collection(db, 'reviews'));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    await Promise.all(
      reviews.map((r) =>
        addDoc(collection(db, 'reviews'), { ...r, createdAt: serverTimestamp() })
      )
    );
  } catch (err) {
    console.error('saveReviews error:', err);
    throw err;
  }
}

export function subscribeToReviews(callback) {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(reviews);
  }, (err) => {
    console.error('subscribeToReviews error:', err);
  });
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

export async function saveObservership(programs) {
  try {
    const snapshot = await getDocs(collection(db, 'observership'));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    await Promise.all(
      programs.map((p, i) =>
        addDoc(collection(db, 'observership'), { ...p, order: i, updatedAt: serverTimestamp() })
      )
    );
  } catch (err) {
    console.error('saveObservership error:', err);
    throw err;
  }
}

// ── Home Content ───────────────────────────────────────────────
export async function getHomeContent() {
  try {
    const q = collection(db, 'home');
    const snapshot = await getDocs(q);
    const data = {};
    snapshot.docs.forEach(doc => {
      Object.assign(data, doc.data());
    });
    return Object.keys(data).length > 0 ? data : null;
  } catch (err) {
    console.error('getHomeContent error:', err);
    throw err;
  }
}

export async function getHomeContentFromCache() {
  try {
    const q = collection(db, 'home');
    const snapshot = await getDocs(q, { source: 'cache' });
    const data = {};
    snapshot.docs.forEach(doc => {
      Object.assign(data, doc.data());
    });
    return Object.keys(data).length > 0 ? data : null;
  } catch (err) {
    return null;
  }
}

export async function saveHomeContent(data) {
  try {
    // Split data into documents for each section
    const sections = {
      hero: {},
      about: {},
      clinical: {},
      testimonials: { testimonialsItems: data.testimonialsItems || [] }, // Match component key
      cta: {}
    };

    Object.keys(data).forEach(key => {
      if (key.startsWith('hero') || key === 'whatsappNumber') sections.hero[key] = data[key];
      else if (key.startsWith('about')) sections.about[key] = data[key];
      else if (key.startsWith('clinical') || key.startsWith('video')) sections.clinical[key] = data[key];
      else if (key.startsWith('testimonials') && key !== 'testimonialsItems') sections.testimonials[key] = data[key];
      else if (key.startsWith('cta')) sections.cta[key] = data[key];
    });

    const promises = Object.entries(sections).map(([id, docData]) => 
      setDoc(doc(db, 'home', id), { ...docData, updatedAt: serverTimestamp() })
    );
    
    await Promise.all(promises);
  } catch (err) {
    console.error('saveHomeContent error:', err);
    throw err;
  }
}

export function subscribeToHomeContent(callback) {
  const q = collection(db, 'home');
  return onSnapshot(q, (snapshot) => {
    const data = {};
    snapshot.docs.forEach(doc => {
      Object.assign(data, doc.data());
    });
    callback(Object.keys(data).length > 0 ? data : null);
  }, (err) => {
    console.error('subscribeToHomeContent error:', err);
  });
}

// ── Process ────────────────────────────────────────────────────
export async function getProcess() {
  try {
    const q = query(collection(db, 'process'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getProcess error:', err);
    throw err;
  }
}

export async function saveProcess(steps) {
  try {
    const snapshot = await getDocs(collection(db, 'process'));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    await Promise.all(
      steps.map((s, i) =>
        addDoc(collection(db, 'process'), { ...s, order: i, updatedAt: serverTimestamp() })
      )
    );
  } catch (err) {
    console.error('saveProcess error:', err);
    throw err;
  }
}

// ── Admin Countries ────────────────────────────────────────────
export const getAdminCountries = getCountries;

export async function saveAdminCountries(entries) {
  try {
    const snapshot = await getDocs(collection(db, 'countries'));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    await Promise.all(
      entries.map((e, i) =>
        addDoc(collection(db, 'countries'), { ...e, order: i, updatedAt: serverTimestamp() })
      )
    );
  } catch (err) {
    console.error('saveAdminCountries error:', err);
    throw err;
  }
}

// ── Contact Submissions ────────────────────────────────────────
export async function getContactSubmissions() {
  try {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getContactSubmissions error:', err);
    throw err;
  }
}
