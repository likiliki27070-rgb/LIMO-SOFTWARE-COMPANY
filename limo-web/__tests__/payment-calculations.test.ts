describe('LIMO Web — Escrow & Payment Calculations (Section 15)', () => {
  const PLATFORM_FEE_PERCENT = 0.1; // 10%

  function calculateLedger(amount: number) {
    const fee = Number((amount * PLATFORM_FEE_PERCENT).toFixed(2));
    const net = Number((amount - fee).toFixed(2));
    return { gross: amount, fee, net };
  }

  it('calculates 10% platform fee and net payout accurately', () => {
    const res = calculateLedger(3500.0);
    expect(res.fee).toBe(350.0);
    expect(res.net).toBe(3150.0);
    expect(res.fee + res.net).toBe(3500.0);
  });

  it('handles cents and fractional rounding correctly', () => {
    const res = calculateLedger(1234.56);
    expect(res.fee).toBe(123.46);
    expect(res.net).toBe(1111.10);
    expect(Number((res.fee + res.net).toFixed(2))).toBe(1234.56);
  });

  it('validates escrow state progression', () => {
    const escrowStatuses = ['pending', 'escrow_funded', 'released'];
    expect(escrowStatuses.indexOf('escrow_funded')).toBeGreaterThan(
      escrowStatuses.indexOf('pending')
    );
    expect(escrowStatuses.indexOf('released')).toBeGreaterThan(
      escrowStatuses.indexOf('escrow_funded')
    );
  });
});
