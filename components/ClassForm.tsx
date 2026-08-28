'use client'

import { useState } from 'react'
import type { OntologyClass } from '@/lib/storage'

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
