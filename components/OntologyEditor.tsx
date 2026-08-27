'use client'

import { useState, useEffect } from 'react'
import { ClassForm } from './ClassForm'
import { ClassList } from './ClassList'
import { TurtleExport } from './TurtleExport'

interface OntologyClass {
  id: string
  name: string
  namespace: string
  parentClass: string
  description?: string
}

interface Ontology {
  id: string
  name: string
  namespace: string
  description?: string
  classes: OntologyClass[]
}

export function OntologyEditor({
  ontologyId,
  onOntologySelect,
}: {
  ontologyId: string | null
  onOntologySelect: (id: string) => void
}) {
  const [ontology, setOntology] = useState<Ontology | null>(null)
  const [name, setName] = useState('')
  const [namespace, setNamespace] = useState('http://example.com/finance#')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ontologyId) {
      loadOntology()
    }
  }, [ontologyId])

  const loadOntology = async () => {
    if (!ontologyId) return
    try {
      setLoading(true)
      const res = await fetch(`/api/ontologies/${ontologyId}`)
      if (res.ok) {
        const data = await res.json()
        setOntology(data)
        setName(data.name)
        setNamespace(data.namespace)
        setDescription(data.description || '')
      }
    } catch (error) {
      console.error('Failed to load ontology:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!name || !namespace) {
      alert('Name and namespace are required')
      return
    }

    try {
      const url = ontology ? `/api/ontologies/${ontology.id}` : '/api/ontologies'
      const method = ontology ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          namespace,
          description,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setOntology(data)
        onOntologySelect(data.id)
        alert('Ontology saved successfully!')
      }
    } catch (error) {
      alert('Failed to save ontology')
    }
  }

  const handleAddClass = async (classData: {
    name: string
    parentClass: string
    description: string
  }) => {
    if (!ontology) {
      alert('Please save the ontology first')
      return
    }

    try {
      const res = await fetch(`/api/ontologies/${ontology.id}/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...classData,
          namespace,
        }),
      })

      if (res.ok) {
        const newClass = await res.json()
        setOntology({
          ...ontology,
          classes: [...ontology.classes, newClass],
        })
      }
    } catch (error) {
      alert('Failed to add class')
    }
  }

  const handleDeleteClass = async (classId: string) => {
    if (!ontology) return

    try {
      const res = await fetch(
        `/api/ontologies/${ontology.id}/classes/${classId}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        setOntology({
          ...ontology,
          classes: ontology.classes.filter((c) => c.id !== classId),
        })
      }
    } catch (error) {
      alert('Failed to delete class')
    }
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel - Editor */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-700">
        <div className="p-6 border-b border-slate-700 bg-slate-800">
          <h2 className="text-xl font-bold mb-4">
            {ontology ? 'Edit Ontology' : 'Create New Ontology'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ontology Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Financial Assets"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Namespace URI</label>
              <input
                type="text"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                placeholder="http://example.com/ontology#"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none h-20"
                placeholder="Optional description..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Saving...' : ontology ? 'Update Ontology' : 'Create Ontology'}
            </button>
          </div>
        </div>

        {ontology && (
          <div className="flex-1 overflow-auto p-6">
            <ClassForm onAddClass={handleAddClass} />
            <div className="mt-8">
              <ClassList
                classes={ontology.classes}
                onDeleteClass={handleDeleteClass}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Export */}
      {ontology && <TurtleExport ontology={ontology} />}
    </div>
  )
}
