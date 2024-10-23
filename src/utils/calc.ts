// types.ts
export type CommodityType = 'milho' | 'trigo' | 'soja';
export type UnitType = 'bushel' | 'ton' | 'saca' | 'real' ;

// constants.ts
export const DOLAR = 5.43;

// commodityData.ts
export type CommodityData = {
    [key in CommodityType]: {
        [fromUnit in UnitType]?: {
            [toUnit in UnitType]?: number
        }
    }
}


const P_MILHO = 70.00; // Exemplo de preço do milho por saca em reais
const P_TRIGO = 85.00; // Exemplo de preço do trigo por saca em reais
const P_SOJA = 95.00; // Exemplo de preço da soja por saca em reais

const BUSHEL_TO_TON_CONVERSION = {
    milho: 25.40,
    trigo: 27.22,
    soja: 36.74
};

const SACAS_PER_TON = {
    milho: 25.40 * 0.4238,
    trigo: 27.22 * 0.4536,
    soja: 36.74 * 0.4536,
};

export const commodityData = {
    milho: {
        bushel: {
            ton: 1 / BUSHEL_TO_TON_CONVERSION.milho,
            saca: 0.4238,
            real: 0.4238 * P_MILHO / DOLAR,
        },
        ton: {
            bushel: BUSHEL_TO_TON_CONVERSION.milho,
            saca: SACAS_PER_TON.milho,
            real: SACAS_PER_TON.milho * P_MILHO / DOLAR,
        },
        saca: {
            bushel: 1 / 0.4238,
            ton: 1 / SACAS_PER_TON.milho,
            real: P_MILHO,
        },
        real: {
            bushel: DOLAR / (0.4238 * P_MILHO),
            ton: DOLAR / (SACAS_PER_TON.milho * P_MILHO),
            saca: 1 / P_MILHO,
        },
    },
    trigo: {
        bushel: {
            bushel: 1,
            ton: 1 / BUSHEL_TO_TON_CONVERSION.trigo,
            saca: 0.4536,
            real: 0.4536 * P_TRIGO / DOLAR,
        },
        ton: {
            bushel: BUSHEL_TO_TON_CONVERSION.trigo,
            ton:1,
            saca: SACAS_PER_TON.trigo,
            real: SACAS_PER_TON.trigo * P_TRIGO / DOLAR,
        },
        saca: {
            bushel: 1 / 0.4536,
            ton: 1 / SACAS_PER_TON.trigo,
            real: P_TRIGO,
            saca: 1
        },
        real: {
            bushel: DOLAR / (0.4536 * P_TRIGO),
            ton: DOLAR / (SACAS_PER_TON.trigo * P_TRIGO),
            saca: 1 / P_TRIGO,
            real: 1
        },
    },
    soja: {
        bushel: {
            ton: 1 / BUSHEL_TO_TON_CONVERSION.soja,
            saca: 0.4536,
            real: 0.4536 * P_SOJA / DOLAR,
            bushel: 1
        },
        ton: {
            bushel: BUSHEL_TO_TON_CONVERSION.soja,
            saca: SACAS_PER_TON.soja,
            real: SACAS_PER_TON.soja * P_SOJA / DOLAR,
            ton: 1
        },
        saca: {
            bushel: 1 / 0.4536,
            ton: 1 / SACAS_PER_TON.soja,
            real: P_SOJA,
            saca: 1
        },
        real: {
            bushel: DOLAR / (0.4536 * P_SOJA),
            ton: DOLAR / (SACAS_PER_TON.soja * P_SOJA),
            saca: 1 / P_SOJA,
            real: 1
        },
    }
};
export function calculateAll(commodity: CommodityType, fromUnit: UnitType, value: number): {
    bushel: number;
    ton: number;
    saca: number;
    real: number
} {
    const results: { [key in UnitType]?: number } = {
        bushel: 0,
         ton: 0,
         saca: 0,
         real: 0
    } as const;
    const commodityUnits = commodityData[commodity];

    if (!commodityUnits || !(fromUnit in commodityUnits)) {
        throw new Error(`Unidade não suportada para ${commodity}`);
    }

    const fromUnitConversions = commodityUnits[fromUnit as keyof typeof commodityUnits];
    if (fromUnitConversions) {
        Object.entries(fromUnitConversions).forEach(([toUnit, conversionFactor]) => {
            if (toUnit !== fromUnit && conversionFactor !== undefined) {
                results[toUnit as UnitType] = Number((value * conversionFactor).toFixed(2));
            }
        });
    }

    results[fromUnit] = value;
    return results as { bushel: number; ton: number; saca: number; real: number };
}

