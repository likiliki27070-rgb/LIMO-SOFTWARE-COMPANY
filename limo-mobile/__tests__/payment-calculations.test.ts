// ==============================================================================
// LIMO TEST SUITE — FINANCIAL CALCULATIONS & ESCROW LEDGER
// Section 10 & 14: Escrow math, 10% platform fee, and net balance calculations
// ==============================================================================

describe('LIMO Financial Engine & Payment Calculations', () => {
  const PLATFORM_FEE_RATE = 0.1; // 10%

  function calculatePaymentSplit(totalAmount: number) {
    if (totalAmount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }
    const fee = Math.round(totalAmount * PLATFORM_FEE_RATE * 100) / 100;
    const net = Math.round((totalAmount - fee) * 100) / 100;
    return { fee, net };
  }

  it('calculates exact 10% platform fee and net earnings for fixed milestones', () => {
    const split1 = calculatePaymentSplit(3500.0);
    expect(split1.fee).toBe(350.0);
    expect(split1.net).toBe(3150.0);

    const split2 = calculatePaymentSplit(4000.0);
    expect(split2.fee).toBe(400.0);
    expect(split2.net).toBe(3600.0);

    const split3 = calculatePaymentSplit(10500.0);
    expect(split3.fee).toBe(1050.0);
    expect(split3.net).toBe(9450.0);
  });

  it('handles cents and fractional calculations cleanly with standard rounding', () => {
    const split = calculatePaymentSplit(1234.56);
    expect(split.fee).toBe(123.46);
    expect(split.net).toBe(1111.1);
    expect(split.fee + split.net).toBeCloseTo(1234.56, 2);
  });

  it('rejects non-positive payment amounts', () => {
    expect(() => calculatePaymentSplit(0)).toThrow();
    expect(() => calculatePaymentSplit(-500)).toThrow();
  });

  it('calculates correct total platform commission across an escrow ledger', () => {
    const payments = [
      { amount: 3500.0, fee: 350.0, net: 3150.0 },
      { amount: 4000.0, fee: 400.0, net: 3600.0 },
      { amount: 1500.0, fee: 150.0, net: 1350.0 },
    ];

    const totalGross = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalFees = payments.reduce((acc, p) => acc + p.fee, 0);
    const totalNet = payments.reduce((acc, p) => acc + p.net, 0);

    expect(totalGross).toBe(9000.0);
    expect(totalFees).toBe(900.0);
    expect(totalNet).toBe(8100.0);
  });
});
