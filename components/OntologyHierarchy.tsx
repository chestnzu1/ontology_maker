'use client'

import { useMemo, useState } from 'react'
import type { Ontology, OntologyClass } from '@/lib/storage'

interface OntologyHierarchyProps {
  ontology: Ontology | null
}

export function OntologyHierarchy({ ontology }: OntologyHierarchyProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const hierarchy = useMemo(() => {
    if (!ontology || ontology.classes.length === 0) {
      return { roots: [], classMap: new Map() }
    }

    const classMap = new Map(ontology.classes.map((c) => [c.id, c]))
    const childrenMap = new Map<string, OntologyClass[]>()

    // Build children map
    ontology.classes.forEach((cls) => {
      if (cls.parentClass && classMap.has(cls.parentClass)) {
        if (!childrenMap.has(cls.parentClass)) {
          childrenMap.set(cls.parentClass, [])
        }
        childrenMap.get(cls.parentClass)!.push(cls)
      }
    })

    // Find root classes
    const roots = ontology.classes.filter(
      (cls) => !cls.parentClass || !classMap.has(cls.parentClass)
    )

    return { roots, classMap, childrenMap }
  }, [ontology])

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (cls: OntologyClass, level: number, childrenMap: Map<string, OntologyClass[]>) => {
    const children = childrenMap.get(cls.id) || []
    const hasChildren = children.length > 0
    const isExpanded = expandedNodes.has(cls.id)

    return (
      <div key={cls.id}>
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg group"
          style={{ marginLeft: `${level * 20}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleNode(cls.id)}
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-slate-600"
            >
              <span className="text-xs text-slate-400">
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
          )}
          {!hasChildren && <div className="flex-shrink-0 w-5" />}

          <div className="flex-1 min-w-0">
            <div className="font-medium text-blue-400 truncate">{cls.name}</div>
            {cls.description && (
              <div className="text-xs text-slate-500 truncate">{cls.description}</div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {children.map((child) => renderNode(child, level + 1, childrenMap))}
          </div>
        )}
      </div>
    )
  }

  if (!ontology || ontology.classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>No classes yet</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-slate-900 p-4">
      <div className="space-y-1">
        {hierarchy.roots.map((root) =>
          renderNode(root, 0, hierarchy.childrenMap || new Map())
        )}
      </div>
    </div>
  )
}
