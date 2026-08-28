'use client'

import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { Ontology } from '@/lib/storage'

interface OntologyGraphProps {
  ontology: Ontology | null
}

export function OntologyGraph({ ontology }: OntologyGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!ontology || ontology.classes.length === 0) {
      return { nodes: [], edges: [] }
    }

    // Build hierarchy to calculate positions
    const classMap = new Map(ontology.classes.map((c) => [c.id, c]))
    const childMap = new Map<string, string[]>()
    const rootClasses: string[] = []

    // Organize by parent-child relationships
    ontology.classes.forEach((cls) => {
      if (cls.parentClass && classMap.has(cls.parentClass)) {
        if (!childMap.has(cls.parentClass)) {
          childMap.set(cls.parentClass, [])
        }
        childMap.get(cls.parentClass)!.push(cls.id)
      } else {
        rootClasses.push(cls.id)
      }
    })

    const nodes: Node[] = []
    const edges: Edge[] = []
    const positionMap = new Map<string, { x: number; y: number }>()
    let yOffset = 0

    // Recursive function to position nodes in a tree layout
    const positionNode = (classId: string, x: number, y: number, level: number) => {
      positionMap.set(classId, { x, y })

      const children = childMap.get(classId) || []
      const childWidth = 250
      const horizontalSpacing = childWidth + 50

      children.forEach((childId, index) => {
        const childX = x + (index - (children.length - 1) / 2) * horizontalSpacing
        const childY = y + 150
        positionNode(childId, childX, childY, level + 1)
      })
    }

    // Position root classes
    rootClasses.forEach((classId, index) => {
      const x = (index - (rootClasses.length - 1) / 2) * 300
      positionNode(classId, x, 0, 0)
    })

    // Create nodes
    ontology.classes.forEach((cls) => {
      const pos = positionMap.get(cls.id) || { x: 0, y: 0 }

      nodes.push({
        id: cls.id,
        data: {
          label: (
            <div className="text-center">
              <div className="font-bold text-sm">{cls.name}</div>
              {cls.description && (
                <div className="text-xs text-gray-600 mt-1">{cls.description.substring(0, 30)}...</div>
              )}
            </div>
          ),
        },
        position: pos,
        style: {
          background: '#3b82f6',
          color: 'white',
          border: '2px solid #1e40af',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '180px',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      })
    })

    // Create edges
    ontology.classes.forEach((cls) => {
      if (cls.parentClass && classMap.has(cls.parentClass)) {
        edges.push({
          id: `${cls.parentClass}-${cls.id}`,
          source: cls.parentClass,
          target: cls.id,
          animated: false,
          style: { stroke: '#64748b', strokeWidth: 2 },
          label: 'parent',
        })
      }
    })

    return { nodes, edges }
  }, [ontology])

  const [nodes] = useNodesState(initialNodes)
  const [edges] = useEdgesState(initialEdges)

  if (!ontology || ontology.classes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-slate-400">
        <p>Create classes to visualize the ontology graph</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-900">
      <ReactFlow nodes={nodes} edges={edges}>
        <Background color="#334155" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
