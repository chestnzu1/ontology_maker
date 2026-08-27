'use client'

import { useState, useEffect } from 'react'

interface ReferenceOntology {
  id: string
  name: string
  uri: string
  description: string
  createdAt: string
}

export function ReferenceOntologyManager() {
  const [ontologies, setOntologies] = useState<ReferenceOntology[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [uri, setUri] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadOntologies()
  }, [])

  const loadOntologies = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/reference-ontologies')
      if (res.ok) {
        const data = await res.json()
        setOntologies(data)
      }
    } catch (error) {
      console.error('Failed to load reference ontologies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !uri) {
      alert('Name and URI are required')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch('/api/reference-ontologies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          uri,
          description,
        }),
      })

      if (res.ok) {
        const newOntology = await res.json()
        setOntologies([newOntology, ...ontologies])
        setName('')
        setUri('')
        setDescription('')
        setShowForm(false)
        alert('Reference ontology added successfully!')
      } else {
        alert('Failed to add reference ontology')
      }
    } catch (error) {
      alert('Failed to add reference ontology')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, ontologyName: string) => {
    if (!confirm(`Delete reference ontology "${ontologyName}"?`)) return

    try {
      const res = await fetch(`/api/reference-ontologies/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setOntologies(ontologies.filter((o) => o.id !== id))
      }
    } catch (error) {
      alert('Failed to delete reference ontology')
    }
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Reference Ontologies</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Reference'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-700 rounded-lg p-6 mb-6 border border-slate-600"
        >
          <h3 className="text-lg font-bold mb-4">Add New Reference Ontology</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Account"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URI</label>
              <input
                type="text"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                placeholder="http://purl.org/onto/fibo/core/account/Account"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none h-20"
                placeholder="Describe this reference ontology..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add Reference Ontology'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-slate-400">Loading reference ontologies...</div>
      ) : ontologies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No reference ontologies yet</p>
          <p className="text-sm text-slate-500">Add your first reference ontology to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ontologies.map((onto) => (
            <div
              key={onto.id}
              className="bg-slate-700 rounded-lg p-6 border border-slate-600"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-400 mb-1">{onto.name}</h3>
                  {onto.description && (
                    <p className="text-sm text-slate-300 mb-2">{onto.description}</p>
                  )}
                  <p className="text-xs text-slate-400 break-all mb-2">{onto.uri}</p>
                </div>

                <button
                  onClick={() => handleDelete(onto.id, onto.name)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-sm transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
