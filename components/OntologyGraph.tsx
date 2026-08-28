'use client'

import { useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { Ontology } from '@/lib/storage'

interface OntologyGraphProps {
  ontology: Ontology | null
}

const nodeWidth = 180
const nodeHeight = 80

export function OntologyGraph({ ontology }: OntologyGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!ontology || ontology.classes.length === 0) {
      return { nodes: [], edges: [] }
    }

    const nodes: Node[] = []
    const edges: Edge[] = []

    // Build a map of classes for quick lookup
    const classMap = new Map(ontology.classes.map((c) => [c.id, c]))

    // Calculate depth for each node (for hierarchical layout)
    const depthMap = new Map<string, number>()
    const childrenMap = new Map<string, string[]>()

    ontology.classes.forEach((cls) => {
      if (!childrenMap.has(cls.parentClass)) {
        childrenMap.set(cls.parentClass, [])
      }
      childrenMap.get(cls.parentClass)!.push(cls.id)
    })

    // Calculate positions using a simple tree layout
    const positionMap = new Map<string, { x: number; y: number }>()
    let nodeCounter = 0

    const layoutNode = (classId: string, depth: number, siblingIndex: number, siblingCount: number) => {
      const x = (siblingIndex - (siblingCount - 1) / 2) * 300
      const y = depth * 150
      positionMap.set(classId, { x, y })

      const children = childrenMap.get(classId) || []
      children.forEach((childId, index) => {
        layoutNode(childId, depth + 1, index, children.length)
      })
    }

    // Start layout from root nodes (those without parents or with non-existent parents)
    const rootNodes = ontology.classes.filter(
      (cls) => !cls.parentClass || !classMap.has(cls.parentClass)
    )

    rootNodes.forEach((root, index) => {
      layoutNode(root.id, 0, index, rootNodes.length)
    })

    // Create nodes
    ontology.classes.forEach((cls) => {
      const pos = positionMap.get(cls.id) || { x: 0, y: 0 }

      nodes.push({
        id: cls.id,
        data: {
          label: (
            <div>
              <div className="font-bold">{cls.name}</div>
              {cls.description && (
                <div className="text-xs opacity-75 mt-1">{cls.description.substring(0, 25)}...</div>
              )}
            </div>
          ),
        },
        position: pos,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        style: {
          background: '#3b82f6',
          color: 'white',
          border: '2px solid #1e40af',
          borderRadius: '8px',
          padding: '10px',
          width: `${nodeWidth}px`,
          textAlign: 'center',
          fontSize: '12px',
        },
      })
    })

    // Create edges
    ontology.classes.forEach((cls) => {
      if (cls.parentClass && classMap.has(cls.parentClass)) {
        edges.push({
          id: `edge-${cls.parentClass}-${cls.id}`,
          source: cls.parentClass,
          target: cls.id,
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 },
        })
      }
    })

    return { nodes, edges }
  }, [ontology])

  const [nodes] = useNodesState(initialNodes)
  const [edges] = useEdgesState(initialEdges)

  if (!ontology || ontology.classes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
        <p>Create classes to visualize the ontology graph</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#334155" gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
