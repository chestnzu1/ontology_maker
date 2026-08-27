import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, uri, description } = body

    const ontology = await prisma.referenceOntology.update({
      where: { id: params.id },
      data: {
        name,
        uri,
        description,
      },
    })

    return NextResponse.json(ontology)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reference ontology' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.referenceOntology.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete reference ontology' }, { status: 500 })
  }
}
