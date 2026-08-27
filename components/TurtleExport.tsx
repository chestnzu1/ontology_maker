'use client'

import { useState } from 'react'

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

interface TurtleExportProps {
  ontology: Ontology
}

export function TurtleExport({ ontology }: TurtleExportProps) {
  const [copied, setCopied] = useState(false)

  const generateTurtle = () => {
    let turtle = '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n'
    turtle += '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n'
    turtle += '@prefix owl: <http://www.w3.org/2002/07/owl#> .\n'
    turtle += '@prefix fibo: <http://purl.org/onto/fibo/> .\n\n'

    const prefix = 'fin'
    turtle += `@prefix ${prefix}: <${ontology.namespace}> .\n\n`

    if (ontology.description) {
      turtle += `# Ontology: ${ontology.name}\n`
      turtle += `# Description: ${ontology.description}\n\n`
    }

    ontology.classes.forEach((cls) => {
      turtle += `${prefix}:${cls.name} a owl:Class ;\n`
      turtle += `    rdfs:label "${cls.name}" ;\n`
      turtle += `    rdfs:subClassOf ${prefix}:${cls.parentClass} ;\n`

      if (cls.description) {
        turtle += `    rdfs:comment "${cls.description}" ;\n`
      }

      turtle += `    rdfs:isDefinedBy <${ontology.namespace}> .\n\n`
    })

    return turtle
  }

  const turtle = generateTurtle()

  const handleCopy = () => {
    navigator.clipboard.writeText(turtle)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([turtle], { type: 'text/turtle' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${ontology.name.toLowerCase().replace(/\s+/g, '-')}.ttl`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h3 className="text-lg font-bold mb-4">Turtle Export</h3>

        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-sm"
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors text-sm"
          >
            Download .ttl File
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-words">
          {turtle}
        </pre>
      </div>
    </div>
  )
}
