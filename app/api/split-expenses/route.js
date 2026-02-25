import { NextResponse } from 'next/server';
import { calculateSettlements } from '@/lib/expenseSplitter';

export async function POST(request) {
    try {
        const { expenses, members } = await request.json();

        if (!expenses || !members || !Array.isArray(expenses) || !Array.isArray(members)) {
            return NextResponse.json({ error: 'expenses and members arrays are required' }, { status: 400 });
        }

        if (members.length < 2) {
            return NextResponse.json({ error: 'At least 2 members required' }, { status: 400 });
        }

        const result = calculateSettlements(expenses, members);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Split API Error:', error);
        return NextResponse.json({ error: 'Failed to calculate settlements' }, { status: 500 });
    }
}
