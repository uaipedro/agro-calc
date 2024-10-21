import React, { useState, useEffect } from 'react';
import { calculateAll } from '@/utils/calc';
import { CommodityType, UnitType } from '@/utils/calc';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button";

const commodities: CommodityType[] = ['milho', 'trigo', 'soja'];
const units: UnitType[] = ['bushel', 'ton', 'saca', 'real'];

const commodityNames: { [key in CommodityType]: string } = {
    milho: 'Milho',
    trigo: 'Trigo',
    soja: 'Soja',
};

const unitNames: { [key in UnitType]: string } = {
    bushel: 'Bushel',
    ton: 'Tonelada',
    saca: 'Saca',
    real: 'Real'
};

const Calculator: React.FC = () => {
    const [commodity, setCommodity] = useState<CommodityType>('milho');
    const [fromUnit, setFromUnit] = useState<UnitType>('bushel');
    const [value, setValue] = useState<number>(1);
    const [results, setResults] = useState<{ [key in UnitType]?: number }>({});

    // ... existing code ...


    useEffect(() => {
        try {
            const newResults = calculateAll(commodity, fromUnit, value);
            setResults(newResults);
        } catch (error) {
            console.error(error);
            setResults({});
        }
    }, [commodity, fromUnit, value]);

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Calculadora de Commodities</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1  gap-6 mb-6">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">
                            Selecione a Commodity
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {commodities.map((c) => (
                                <Button
                                    key={c}
                                    variant={commodity === c ? "default" : "outline"}
                                    onClick={() => setCommodity(c)}
                                >
                                    {commodityNames[c]}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-sm font-medium mb-2 block">
                            Unidade de Entrada e Valor
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-grow">
                                <div className="flex flex-wrap gap-2">
                                    {units.map((u) => (
                                        <Button
                                            key={u}
                                            variant={fromUnit === u ? "default" : "outline"}
                                            onClick={() => setFromUnit(u)}
                                        >
                                            {unitNames[u]}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <Input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="w-24"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {units.map((unit) => (
                        <Card key={unit}>
                            <CardHeader>
                                <CardTitle className="text-lg">{unitNames[unit]}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-primary">
                                    {unit === 'real' ? 'R$ ' : ''}
                                    {results[unit]?.toFixed(2) || '0.00'}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Calculator;