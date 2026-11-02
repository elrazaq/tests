import assert from 'node:assert';

// 1. Test Cart Totals Calculation
const mockCart = [
  { product: { id: 1, name: 'Headphones', price: 1000, stepMultiple: 1 }, quantity: 3 },
  { product: { id: 7, name: 'USB Pack', price: 500, stepMultiple: 5 }, quantity: 10 },
];

const totals = mockCart.reduce(
  (acc, item) => {
    acc.totalQuantity += item.quantity;
    acc.totalPrice += item.product.price * item.quantity;
    acc.totalUniqueItems += 1;
    return acc;
  },
  { totalQuantity: 0, totalPrice: 0, totalUniqueItems: 0 }
);

assert.strictEqual(totals.totalQuantity, 13, 'Total quantity must sum individual item quantities (3 + 10 = 13)');
assert.strictEqual(totals.totalPrice, 3 * 1000 + 10 * 500, 'Total price must match subtotal calculation');
assert.strictEqual(totals.totalUniqueItems, 2, 'Total unique items must be 2');

// 2. Test Step Multiple Adjustment
function stepQuantity(current, step, direction) {
  const next = current + direction * step;
  return next <= 0 ? 0 : next;
}

assert.strictEqual(stepQuantity(5, 5, 1), 10, 'Step up by 5 should yield 10');
assert.strictEqual(stepQuantity(10, 5, -1), 5, 'Step down by 5 should yield 5');
assert.strictEqual(stepQuantity(5, 5, -1), 0, 'Step down to 0 signals removal');

// 3. Test Alignment for Direct Input
function alignStep(val, step) {
  if (step > 1 && val % step !== 0) {
    let aligned = Math.round(val / step) * step;
    return aligned < step ? step : aligned;
  }
  return val;
}

assert.strictEqual(alignStep(12, 5), 10, '12 with step 5 aligns to 10');
assert.strictEqual(alignStep(13, 5), 15, '13 with step 5 aligns to 15');
assert.strictEqual(alignStep(15, 5), 15, '15 with step 5 remains 15');

console.log('All M0 logic assertions passed successfully!');

