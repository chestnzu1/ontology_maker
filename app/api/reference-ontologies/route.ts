import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const ontologies = await prisma.referenceOntology.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(ontologies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reference ontologies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, uri, description } = body

    if (!name || !uri) {
      return NextResponse.json({ error: 'Name and URI are required' }, { status: 400 })
    }

    const ontology = await prisma.referenceOntology.create({
      data: {
        name,
        uri,
        description: description || '',
      },
    })

    return NextResponse.json(ontology, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ontology name already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create reference ontology' }, { status: 500 })
  }
}
