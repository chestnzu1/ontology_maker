export interface OntologyClass {
  id: string
  name: string
  namespace: string
  parentClass: string
  description?: string
}

export interface Ontology {
  id: string
  name: string
  namespace: string
  description?: string
  classes: OntologyClass[]
  createdAt: number
  updatedAt: number
}

const ONTOLOGIES_KEY = 'ontologies'

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function getAllOntologies(): Ontology[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(ONTOLOGIES_KEY)
  return data ? JSON.parse(data) : []
}

export function getOntology(id: string): Ontology | null {
  const ontologies = getAllOntologies()
  return ontologies.find((o) => o.id === id) || null
}

export function saveOntology(
  ontology: Omit<Ontology, 'id' | 'createdAt' | 'updatedAt'>
): Ontology
export function saveOntology(ontology: Ontology): Ontology
export function saveOntology(
  ontology: Ontology | Omit<Ontology, 'id' | 'createdAt' | 'updatedAt'>
): Ontology {
  if (typeof window === 'undefined') return ontology as Ontology

  const ontologies = getAllOntologies()
  const now = Date.now()

  if ('id' in ontology && 'createdAt' in ontology) {
    // Update existing
    const index = ontologies.findIndex((o) => o.id === ontology.id)
    if (index !== -1) {
      const updated = { ...ontology, updatedAt: now } as Ontology
      ontologies[index] = updated
      localStorage.setItem(ONTOLOGIES_KEY, JSON.stringify(ontologies))
      return updated
    }
  }

  // Create new
  const newOntology: Ontology = {
    id: generateId(),
    ...(ontology as Omit<Ontology, 'id' | 'createdAt' | 'updatedAt'>),
    createdAt: now,
    updatedAt: now,
  }
  ontologies.push(newOntology)
  localStorage.setItem(ONTOLOGIES_KEY, JSON.stringify(ontologies))
  return newOntology
}

export function deleteOntology(id: string): boolean {
  if (typeof window === 'undefined') return false

  const ontologies = getAllOntologies()
  const filtered = ontologies.filter((o) => o.id !== id)

  if (filtered.length === ontologies.length) return false

  localStorage.setItem(ONTOLOGIES_KEY, JSON.stringify(filtered))
  return true
}

export function addClassToOntology(
  ontologyId: string,
  classData: Omit<OntologyClass, 'id'>
): OntologyClass | null {
  if (typeof window === 'undefined') return null

  const ontology = getOntology(ontologyId)
  if (!ontology) return null

  const newClass: OntologyClass = {
    id: generateId(),
    ...classData,
  }

  ontology.classes.push(newClass)
  saveOntology(ontology)
  return newClass
}

export function deleteClassFromOntology(
  ontologyId: string,
  classId: string
): boolean {
  if (typeof window === 'undefined') return false

  const ontology = getOntology(ontologyId)
  if (!ontology) return false

  const filtered = ontology.classes.filter((c) => c.id !== classId)
  if (filtered.length === ontology.classes.length) return false

  ontology.classes = filtered
  saveOntology(ontology)
  return true
}
