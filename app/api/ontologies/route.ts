import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const ontologies = await prisma.ontology.findMany({
      include: {
        classes: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(ontologies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ontologies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, namespace, description } = body

    if (!name || !namespace) {
      return NextResponse.json({ error: 'Name and namespace are required' }, { status: 400 })
    }

    const ontology = await prisma.ontology.create({
      data: {
        name,
        namespace,
        description: description || '',
      },
      include: {
        classes: true,
      },
    })

    return NextResponse.json(ontology, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ontology' }, { status: 500 })
  }
}
