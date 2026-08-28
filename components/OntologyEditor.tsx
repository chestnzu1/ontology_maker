'use client'

import { useState, useEffect } from 'react'
import { ClassForm } from './ClassForm'
import { ClassList } from './ClassList'
import { TurtleExport } from './TurtleExport'
import { OntologyGraph } from './OntologyGraph'
import {
  saveOntology,
  getOntology,
  addClassToOntology,
  deleteClassFromOntology,
  type Ontology,
} from '@/lib/storage'

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
  const [rightPanelView, setRightPanelView] = useState<'export' | 'graph'>('export')

  useEffect(() => {
    if (ontologyId) {
      loadOntology()
    }
  }, [ontologyId])

  const loadOntology = () => {
    if (!ontologyId) return
    setLoading(true)
    const data = getOntology(ontologyId)
    if (data) {
      setOntology(data)
      setName(data.name)
      setNamespace(data.namespace)
      setDescription(data.description || '')
    }
    setLoading(false)
  }

  const handleSave = () => {
    if (!name || !namespace) {
      alert('Name and namespace are required')
      return
    }

    const data = saveOntology(
      ontology
        ? { ...ontology, name, namespace, description }
        : { name, namespace, description, classes: [] }
    )
    setOntology(data)
    onOntologySelect(data.id)
    alert('Ontology saved successfully!')
  }

  const handleAddClass = (classData: {
    name: string
    parentClass: string
    description: string
  }) => {
    if (!ontology) {
      alert('Please save the ontology first')
      return
    }

    const newClass = addClassToOntology(ontology.id, {
      ...classData,
      namespace,
    })

    if (newClass) {
      setOntology({
        ...ontology,
        classes: [...ontology.classes, newClass],
      })
    }
  }

  const handleDeleteClass = (classId: string) => {
    if (!ontology) return

    if (deleteClassFromOntology(ontology.id, classId)) {
      setOntology({
        ...ontology,
        classes: ontology.classes.filter((c) => c.id !== classId),
      })
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
            <ClassForm onAddClass={handleAddClass} existingClasses={ontology.classes} />
            <div className="mt-8">
              <ClassList
                classes={ontology.classes}
                onDeleteClass={handleDeleteClass}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Tabs */}
      {ontology && (
        <div className="flex-1 flex flex-col overflow-hidden border-l border-slate-700">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700 bg-slate-800">
            <button
              onClick={() => setRightPanelView('export')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                rightPanelView === 'export'
                  ? 'bg-slate-700 text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setRightPanelView('graph')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                rightPanelView === 'graph'
                  ? 'bg-slate-700 text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Graph
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {rightPanelView === 'export' && <TurtleExport ontology={ontology} />}
            {rightPanelView === 'graph' && <OntologyGraph ontology={ontology} />}
          </div>
        </div>
      )}
    </div>
  )
}
