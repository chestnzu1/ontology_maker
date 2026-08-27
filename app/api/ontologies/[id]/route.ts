import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ontology = await prisma.ontology.findUnique({
      where: { id: params.id },
      include: {
        classes: true,
      },
    })

    if (!ontology) {
      return NextResponse.json({ error: 'Ontology not found' }, { status: 404 })
    }

    return NextResponse.json(ontology)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ontology' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, namespace, description, turtleData } = body

    const ontology = await prisma.ontology.update({
      where: { id: params.id },
      data: {
        name,
        namespace,
        description,
        turtleData,
      },
      include: {
        classes: true,
      },
    })

    return NextResponse.json(ontology)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ontology' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ontology.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete ontology' }, { status: 500 })
  }
}
