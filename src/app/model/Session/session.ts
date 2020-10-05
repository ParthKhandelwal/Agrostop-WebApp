export class Session {
    sessionId: string;
    userId: string;
    date: Date;
    openingBalance: number;
    cashWithdrawn: number;
    entries: CashEntry[];
    cashLedgers
}

export class CashEntry{
    narration: string;
    amount: number
}
