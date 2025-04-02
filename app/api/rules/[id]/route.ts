import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';


// DELETE /api/rules/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    await prisma.codeReviewRules.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting rule:', error);
    return NextResponse.json(
      { error: 'Failed to delete rule' },
      { status: 500 }
    );
  }
} 