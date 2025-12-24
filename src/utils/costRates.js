export const BASE_RATES = {
  parcel: {
    normal: {
      same: 60,
      outside: 110,
    },
    hub: {
      same: 40,
      outside: 80,
    },
    urgent: {
      same: 120,
      outside: 200,
    },
  },
  fragile: {
    normal: {
      same: 100,
      outside: 150,
    },
    hub: {
      same: 60,
      outside: 110,
    },
    urgent: {
      same: 150,
      outside: 250,
    },
  },
};

export const PAYMENT_FEES = {
  hub: {
    cod: 20,
    prepaid: 20,
  },
  normal: {
    cod: 50,
    prepaid: 35,
  },
  urgent: {
    cod: 70,
    prepaid: 50,
  },
};

export const EXTRA_WEIGHT_COST = 30;
