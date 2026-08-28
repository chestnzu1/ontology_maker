'use client'

import { useState, useEffect } from 'react'
import { getAllOntologies, deleteOntology, type Ontology } from '@/lib/storage'

interface OntologyListProps {
  onSelectOntology: (id: string) => void
}

export function OntologyList({ onSelectOntology }: OntologyListProps) {
  const [ontologies, setOntologies] = useState<Ontology[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOntologies()
  }, [])

  const loadOntologies = () => {
    setLoading(true)
    const data = getAllOntologies()
    setOntologies(data)
    setLoading(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete ontology "${name}"?`)) return

    if (deleteOntology(id)) {
      setOntologies(ontologies.filter((o) => o.id !== id))
    } else {
      alert('Failed to delete ontology')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-400">Loading ontologies...</div>
      </div>
    )
  }

  if (ontologies.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No ontologies yet</p>
          <p className="text-sm text-slate-500">Create your first ontology using the New Ontology tab</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-xl font-bold mb-6">Your Ontologies</h2>

      <div className="grid grid-cols-1 gap-4">
        {ontologies.map((onto) => (
          <div
            key={onto.id}
            className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-400 mb-1">{onto.name}</h3>
                {onto.description && (
                  <p className="text-sm text-slate-300 mb-2">{onto.description}</p>
                )}
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>{onto.classes.length} classes</span>
                  <span>
                    {new Date(onto.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onSelectOntology(onto.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(onto.id, onto.name)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
