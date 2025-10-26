/**
 * dataLoader.js
 * Eenvoudige loaders: projects, socials, skills (JSON)
 */

export async function loadProjects() {
  const res = await fetch('data/projects.json');
  if (!res.ok) throw new Error('projects.json niet gevonden');
  const data = await res.json();
  // returns array of categories (data.categories)
  return data.categories || [];
}

export async function loadSocials() {
  const res = await fetch('data/socials.json');
  if (!res.ok) return [];
  return await res.json();
}

export async function loadSkills() {
  const res = await fetch('data/skills.json');
  if (!res.ok) return [];
  return await res.json();
}
