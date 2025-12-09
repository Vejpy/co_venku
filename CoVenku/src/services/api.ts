export default async function getAllPlaces() {
  try {
    const res = await fetch('http://172.26.10.213:7247/api/CulturePlace/All');
    console.log("RAW RESPONSE:", res);
    const data = await res.json();
    console.log("DATA:", data);
    return data.places;
  } catch (e) {
    console.error("ERROR:", e);
  }
}