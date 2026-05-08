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
  writeBatch,
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
    // Simplified query to avoid the need for a composite index
    const q = query(
      collection(db, 'universities'),
      where('countryId', '==', countryId)
    );
    const snapshot = await getDocs(q);
    
    // Sort in memory to bypass Firebase index requirements
    return snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
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
// ── Unified Team Page Management ──────────────────────────────
// Structure: 
// team/hero (doc)
// team/stats (doc)
// team/quotes (doc)
// team/core/members (sub-coll)
// team/regional/members (sub-coll)

export async function getTeamAllData() {
  try {
    const [heroS, statsS, quotesS, coreS, regionalS] = await Promise.all([
      getDoc(doc(db, 'team', 'hero')),
      getDoc(doc(db, 'team', 'stats')),
      getDoc(doc(db, 'team', 'quotes')),
      getDocs(query(collection(db, 'team', 'core', 'members'), orderBy('order', 'asc'))),
      getDocs(query(collection(db, 'team', 'regional', 'members'), orderBy('order', 'asc')))
    ]);

    return {
      hero: heroS.exists() ? heroS.data() : null,
      stats: statsS.exists() ? statsS.data()?.items : null,
      quotes: quotesS.exists() ? quotesS.data() : null,
      core: coreS.docs.map(d => ({ id: d.id, ...d.data() })),
      regional: regionalS.docs.map(d => ({ id: d.id, ...d.data() }))
    };
  } catch (err) {
    console.error('getTeamAllData error:', err);
    throw err;
  }
}

export async function saveTeamAllData({ members, regional, settings }) {
  try {
    const batch = writeBatch(db);

    // 1. Hero (Document)
    const heroRef = doc(db, 'team', 'hero');
    batch.set(heroRef, {
      badge: settings.heroBadge || '',
      title: settings.heroTitle || '',
      description: settings.heroDescription || '',
      updatedAt: serverTimestamp()
    });

    // 2. Stats (Document)
    const statsRef = doc(db, 'team', 'stats');
    batch.set(statsRef, {
      items: settings.stats || [],
      updatedAt: serverTimestamp()
    });

    // 3. Quotes (Document)
    const quotesRef = doc(db, 'team', 'quotes');
    batch.set(quotesRef, {
      quote1: settings.quote1 || '',
      quote2: settings.quote2 || '',
      updatedAt: serverTimestamp()
    });

    // 4. Core Members (Sub-collection)
    const coreColl = collection(db, 'team', 'core', 'members');
    const coreSnap = await getDocs(coreColl);
    coreSnap.docs.forEach(d => batch.delete(d.ref));
    members.forEach((m, i) => {
      const mRef = doc(coreColl);
      batch.set(mRef, { ...m, order: i, updatedAt: serverTimestamp() });
    });

    // 5. Regional Experts (Sub-collection)
    const regColl = collection(db, 'team', 'regional', 'members');
    const regSnap = await getDocs(regColl);
    regSnap.docs.forEach(d => batch.delete(d.ref));
    regional.forEach((m, i) => {
      const mRef = doc(regColl);
      batch.set(mRef, { ...m, order: i, updatedAt: serverTimestamp() });
    });

    await batch.commit();
  } catch (err) {
    console.error('saveTeamAllData error:', err);
    throw err;
  }
}

export async function getReviews() {
  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    // Filter out the 'header' document if it exists in the collection
    return snapshot.docs
      .filter(d => d.id !== 'header')
      .map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getReviews error:', err);
    throw err;
  }
}

export async function saveReviews(reviews) {
  try {
    const snapshot = await getDocs(collection(db, 'reviews'));
    // ONLY delete documents that are NOT the 'header' config
    const deletePromises = snapshot.docs
      .filter(d => d.id !== 'header')
      .map((d) => deleteDoc(d.ref));
    
    await Promise.all(deletePromises);
    
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

export async function getReviewsHeader() {
  try {
    const d = await getDoc(doc(db, 'reviews', 'header'));
    return d.exists() ? d.data() : { badge: 'Real Feedback', title: 'Parent & Student Reviews' };
  } catch (err) {
    console.error('getReviewsHeader error:', err);
    return { badge: 'Real Feedback', title: 'Parent & Student Reviews' };
  }
}

export async function saveReviewsHeader(data) {
  try {
    await setDoc(doc(db, 'reviews', 'header'), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error('saveReviewsHeader error:', err);
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
    const d = await getDoc(doc(db, 'observership', 'main'));
    return d.exists() ? d.data() : null;
  } catch (err) {
    console.error('getObservership error:', err);
    throw err;
  }
}

export async function saveObservership(data) {
  try {
    await setDoc(doc(db, 'observership', 'main'), {
      ...data,
      updatedAt: serverTimestamp()
    });
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
export async function getProcessAllData() {
  try {
    // 1. Get Header/Footer data from subcollection (process/main/headerfooter)
    const hfRef = collection(db, 'process', 'main', 'headerfooter');
    const hfSnap = await getDocs(hfRef);
    const settings = hfSnap.docs.length > 0 ? hfSnap.docs[0].data() : null;

    // 2. Get Steps from subcollection (process/main/steps)
    const stepsQ = query(collection(db, 'process', 'main', 'steps'), orderBy('order', 'asc'));
    const stepsSnap = await getDocs(stepsQ);
    const steps = stepsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return { steps, settings };
  } catch (err) {
    console.error('getProcessAllData error:', err);
    throw err;
  }
}

export async function saveProcessAllData(steps, settings) {
  try {
    const batch = writeBatch(db);

    // 1. Sync Header/Footer (process/main/headerfooter)
    const hfRef = collection(db, 'process', 'main', 'headerfooter');
    const hfSnap = await getDocs(hfRef);
    hfSnap.docs.forEach(d => batch.delete(d.ref));
    const newHfDoc = doc(hfRef);
    batch.set(newHfDoc, { ...settings, updatedAt: serverTimestamp() });

    // 2. Sync Steps (process/main/steps)
    const stepsRef = collection(db, 'process', 'main', 'steps');
    const stepsSnap = await getDocs(stepsRef);
    stepsSnap.docs.forEach(d => batch.delete(d.ref));
    steps.forEach((s, i) => {
      const newStepDoc = doc(stepsRef);
      batch.set(newStepDoc, { ...s, order: i + 1, updatedAt: serverTimestamp() });
    });

    await batch.commit();
  } catch (err) {
    console.error('saveProcessAllData error:', err);
    throw err;
  }
}

// Deprecated - for backward compatibility if needed temporarily
export const getProcess = async () => {
  const data = await getProcessAllData();
  return data.steps;
};
export const saveProcess = async (steps) => {
  await saveProcessAllData(steps, {});
};

// ── Admin Countries ────────────────────────────────────────────
export const getAdminCountries = getCountries;

export async function saveAdminCountries(entries) {
  try {
    const batch = writeBatch(db);
    const snapshot = await getDocs(collection(db, 'countries'));
    
    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    entries.forEach((e, i) => {
      const newDocRef = doc(collection(db, 'countries'));
      const { id, ...data } = e;
      batch.set(newDocRef, { 
        ...data, 
        order: i, 
        updatedAt: serverTimestamp() 
      });
    });

    await batch.commit();
  } catch (err) {
    console.error('saveAdminCountries error:', err);
    throw err;
  }
}

// ── Contact Page Settings ────────────────────────────────────
export async function getContactPageData() {
  try {
    const d = await getDoc(doc(db, 'contactus', 'main'));
    return d.exists() ? d.data() : null;
  } catch (err) {
    console.error('getContactPageData error:', err);
    throw err;
  }
}

export async function saveContactPageData(data) {
  try {
    await setDoc(doc(db, 'contactus', 'main'), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error('saveContactPageData error:', err);
    throw err;
  }
}

// ── Contact Submissions ────────────────────────────────────────
export async function getContactSubmissions() {
  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getContactSubmissions error:', err);
    throw err;
  }
}

export async function saveContactSubmission(data) {
  try {
    const contactRef = collection(db, 'messages');
    await addDoc(contactRef, {
      ...data,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('saveContactSubmission error:', err);
    throw err;
  }
}

