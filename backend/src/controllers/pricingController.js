const RATES = {
  standard: { short: 1, r2: 2.0, r3: 1.5 },
  premium:  { short: 1, r2: 2.5, r3: 2.0 },
  van:      { short: 1, r2: 3.0, r3: 2.5 },
};

const FIXED_PRICES = {
  airport_cdg: { standard: 65, premium: 95, van: 120 },
  airport_orly: { standard: 55, premium: 80, van: 105 },
  airport_beauvais: { standard: 120, premium: 165, van: 200 },
  disneyland: { standard: 75, premium: 110, van: 140 },
};

export const calculatePrice = (req, res) => {
  const { distanceKm, vehicleType, serviceType } = req.body;

  if (serviceType && FIXED_PRICES[serviceType]) {
    const prices = FIXED_PRICES[serviceType];
    return res.json({
      standard: prices.standard,
      premium: prices.premium,
      van: prices.van,
      isFixed: true,
    });
  }

  if (!distanceKm || distanceKm <= 0) {
    return res.status(400).json({ error: 'Distance invalide' });
  }

  const computePrice = (type) => {
    const r = RATES[type];
    if (distanceKm < 10) return r.short;
    if (distanceKm < 20) return r.short + (distanceKm - 10) * r.r2;
    return r.short + 10 * r.r2 + (distanceKm - 20) * r.r3;
  };

  res.json({
    standard: Math.round(computePrice('standard') * 100) / 100,
    premium: Math.round(computePrice('premium') * 100) / 100,
    van: Math.round(computePrice('van') * 100) / 100,
    isFixed: false,
    distanceKm,
  });
};
