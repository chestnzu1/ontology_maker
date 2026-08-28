'use client'

import { useState, useEffect } from 'react'
import type { OntologyClass } from '@/lib/storage'

interface ReferenceOntology {
  id: string
  name: string
  uri: string
  description: string
}

interface ClassFormProps {
  existingClasses?: OntologyClass[]
  onAddClass: (classData: {
    name: string
    parentClass: string
    description: string
  }) => void
}

export function ClassForm({ existingClasses = [], onAddClass }: ClassFormProps) {
  const [className, setClassName] = useState('')
  const [parentClassId, setParentClassId] = useState('')
  const [description, setDescription] = useState('')
  const [references, setReferences] = useState<ReferenceOntology[]>([])
  const [filteredReferences, setFilteredReferences] = useState<ReferenceOntology[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [referenceSearch, setReferenceSearch] = useState('')

  useEffect(() => {
    loadReferences()
  }, [])

  const loadReferences = async () => {
    try {
      const res = await fetch('/api/reference-ontologies')
      if (res.ok) {
        const data = await res.json()
        setReferences(data)
        setFilteredReferences(data)
      }
    } catch (error) {
      console.error('Failed to load reference ontologies:', error)
    }
  }

  const handleReferenceSearch = (value: string) => {
    setReferenceSearch(value)
    if (value) {
      const filtered = references.filter((ref) =>
        ref.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredReferences(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredReferences(references)
      setShowSuggestions(false)
    }
  }

  const handleSelectReference = (ref: ReferenceOntology) => {
    setClassName(ref.name)
    setDescription(ref.description)
    setReferenceSearch('')
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!className) {
      alert('Class name is required')
      return
    }

    onAddClass({
      name: className,
      parentClass: parentClassId || '',
      description,
    })

    setClassName('')
    setParentClassId('')
    setDescription('')
    setReferenceSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Add New Class</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Class Name</label>
          <div className="relative">
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., BankAccount or search reference ontologies"
            />

            {showSuggestions && filteredReferences.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-600 border border-slate-500 rounded-lg overflow-hidden z-10 max-h-48 overflow-y-auto">
                {filteredReferences.map((ref) => (
                  <button
                    key={ref.id}
                    type="button"
                    onClick={() => handleSelectReference(ref)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-500 transition-colors border-b border-slate-500 last:border-b-0"
                  >
                    <div className="font-medium">{ref.name}</div>
                    <div className="text-xs text-slate-300">{ref.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Parent Class (Optional)</label>
          <select
            value={parentClassId}
            onChange={(e) => setParentClassId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          >
            <option value="">None (Root Class)</option>
            {existingClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none h-20"
            placeholder="Optional description..."
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Add Class
        </button>
      </div>
    </form>
  )
}
