export const calculateTotals = (product, numberAmount, user) => {
  const quantity = numberAmount === undefined ? parseFloat(product?.amount) : parseFloat(numberAmount) || 1;
  const pricePerUnit = parseFloat(product?.price) || 0;
  const dphRate = product?.dph ? parseFloat(product?.dph) / 100 : 0;
  const isDphIncluded = product?.dphType === "S DPH";
  const discount = parseFloat(product?.discount) || 0;
  const discountIsPercentage = product?.discountType === "%";

  let priceWithoutDph = isDphIncluded
    ? pricePerUnit / (1 + dphRate)
    : pricePerUnit;
  let totalPriceWithoutDph = priceWithoutDph * quantity;
  let dphAmount = product?.dph ? totalPriceWithoutDph * dphRate : 0;
  let discountAmount = product?.discount
    ? discountIsPercentage
      ? (totalPriceWithoutDph * discount) / 100
      : discount
    : 0;

  let totalWithDph = totalPriceWithoutDph + dphAmount - discountAmount;
  let totalWithoutDph = totalPriceWithoutDph - discountAmount;

  if (totalWithDph < 0) totalWithDph = 0;
  if (totalWithoutDph < 0) totalWithoutDph = 0;

  const finalTotal = user?.dph === "Plátce DPH" ? totalWithDph : totalWithoutDph;

  return {
    priceWithoutDph: totalPriceWithoutDph.toFixed(2),
    dphAmount: dphAmount > 0 ? dphAmount.toFixed(2) : null,
    discountAmount: discountAmount > 0 ? discountAmount.toFixed(2) : null,
    totalWithDph: finalTotal.toFixed(2),
  };
};

export const calculateInvoiceTotal = (products, user) => {
  const total = products.reduce((sum, product) => {
    const pricePerUnit = parseFloat(product.price);
    const dphRate = product.dph ? parseFloat(product.dph) / 100 : 0;
    const discount = parseFloat(product.discount);

    let priceWithoutDph =
      product.dphType === "S DPH" ? pricePerUnit / (1 + dphRate) : pricePerUnit;
    let totalPriceWithoutDph = priceWithoutDph * parseFloat(product.amount);
    let dphAmount = product.dph ? totalPriceWithoutDph * dphRate : 0;
    let discountAmount = product.discount
      ? product.discountType === "%"
        ? (totalPriceWithoutDph * discount) / 100
        : discount
      : 0;
    let totalWithDph = totalPriceWithoutDph + dphAmount - discountAmount;
    if (totalWithDph < 0) totalWithDph = 0;

    return user.dph === "Plátce DPH"
      ? sum + totalWithDph
      : sum + totalPriceWithoutDph - discountAmount;
  }, 0);

  return `${total.toFixed(2)} Kč`;
};
