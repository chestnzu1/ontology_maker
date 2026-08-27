import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, namespace, parentClass, description } = body

    if (!name || !namespace || !parentClass) {
      return NextResponse.json(
        { error: 'Name, namespace, and parentClass are required' },
        { status: 400 }
      )
    }

    const ontologyClass = await prisma.ontologyClass.create({
      data: {
        name,
        namespace,
        parentClass,
        description: description || '',
        ontologyId: params.id,
      },
    })

    return NextResponse.json(ontologyClass, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Class name already exists in this ontology' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}
