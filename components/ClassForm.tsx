'use client'

import { useState, useEffect } from 'react'

interface ReferenceOntology {
  id: string
  name: string
  uri: string
  description: string
}

interface ClassFormProps {
  onAddClass: (classData: {
    name: string
    parentClass: string
    description: string
  }) => void
}

export function ClassForm({ onAddClass }: ClassFormProps) {
  const [className, setClassName] = useState('')
  const [parentClass, setParentClass] = useState('')
  const [description, setDescription] = useState('')
  const [references, setReferences] = useState<ReferenceOntology[]>([])
  const [filteredReferences, setFilteredReferences] = useState<ReferenceOntology[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const handleParentChange = (value: string) => {
    setParentClass(value)
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
    setParentClass(ref.name)
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!className || !parentClass) {
      alert('Class name and parent class are required')
      return
    }

    onAddClass({
      name: className,
      parentClass,
      description,
    })

    setClassName('')
    setParentClass('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Add New Class</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Class Name</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., BankAccount"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2">Parent Class</label>
          <input
            type="text"
            value={parentClass}
            onChange={(e) => handleParentChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Select or type..."
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
