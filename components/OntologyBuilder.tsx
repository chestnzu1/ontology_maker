'use client'

import { useState, useEffect } from 'react'
import { OntologyEditor } from './OntologyEditor'
import { OntologyList } from './OntologyList'
import { ReferenceOntologyManager } from './ReferenceOntologyManager'

type TabType = 'editor' | 'list' | 'references'

export function OntologyBuilder() {
  const [activeTab, setActiveTab] = useState<TabType>('editor')
  const [selectedOntologyId, setSelectedOntologyId] = useState<string | null>(null)

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Ontology Builder
            </h1>
            <p className="text-sm text-slate-400 mt-2">Financial Domain</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab('editor')
                setSelectedOntologyId(null)
              }}
              className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              New Ontology
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              My Ontologies
            </button>

            <button
              onClick={() => setActiveTab('references')}
              className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                activeTab === 'references'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Reference Ontologies
            </button>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">v0.1.0</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'editor' && (
            <OntologyEditor
              ontologyId={selectedOntologyId}
              onOntologySelect={setSelectedOntologyId}
            />
          )}
          {activeTab === 'list' && (
            <OntologyList
              onSelectOntology={(id) => {
                setSelectedOntologyId(id)
                setActiveTab('editor')
              }}
            />
          )}
          {activeTab === 'references' && <ReferenceOntologyManager />}
        </div>
      </div>
    </div>
  )
}
