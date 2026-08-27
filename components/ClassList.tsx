'use client'

interface OntologyClass {
  id: string
  name: string
  namespace: string
  parentClass: string
  description?: string
}

interface ClassListProps {
  classes: OntologyClass[]
  onDeleteClass: (classId: string) => void
}

export function ClassList({ classes, onDeleteClass }: ClassListProps) {
  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">No classes added yet</p>
        <p className="text-sm text-slate-500">Add your first class using the form above</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Classes in Ontology</h3>
      <div className="space-y-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-slate-700 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-blue-400 mb-1">{cls.name}</h4>
                <p className="text-sm text-slate-300 mb-2">
                  Parent: <span className="font-medium">{cls.parentClass}</span>
                </p>
                {cls.description && (
                  <p className="text-sm text-slate-400 italic">{cls.description}</p>
                )}
              </div>
              <button
                onClick={() => {
                  if (confirm(`Delete class "${cls.name}"?`)) {
                    onDeleteClass(cls.id)
                  }
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
