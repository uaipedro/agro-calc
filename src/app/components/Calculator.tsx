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
    const [fromUnit, setFromUnit] = useState<UnitType>('bushel');
    const [value, setValue] = useState<number>(1);
    const [results, setResults] = useState<{ [key in CommodityType]: { [key in UnitType]?: number } }>({
        milho: {},
        trigo: {},
        soja: {},
    });

    useEffect(() => {
        try {
            const newResults = commodities.reduce((acc, commodity) => {
                acc[commodity] = calculateAll(commodity, fromUnit, value);
                return acc;
            }, {} as { [key in CommodityType]: { [key in UnitType]?: number } });
            setResults(newResults);
        } catch (error) {
            console.error(error);
            setResults({
                milho: {},
                trigo: {},
                soja: {},
            });
        }
    }, [fromUnit, value]);

    return (
        <Card className="max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Calculadora de Commodities</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-items-start gap-6 mb-6">
                    <div className="flex flex-col">
                        <Label className="text-sm font-medium mb-2 block">
                            Valor de Entrada
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="w-full max-w-36"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">
                            Unidade de Entrada
                        </Label>
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
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {commodities.map((commodity) => (
                        <Card key={commodity}>
                            <CardHeader>
                                <CardTitle className="text-xl">{commodityNames[commodity]}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {units.map((unit) => (
                                        <div key={unit} className="text-center">
                                            <div className="mb-2">
                                                <p className="text-2xl font-bold text-primary">
                                                    {unit === 'real' ? 'R$ ' : ''}
                                                    {results[commodity][unit]?.toFixed(2) || '0.00'}
                                                </p>
                                                <Label className="text-sm text-gray-500">
                                                    {unitNames[unit]}
                                                </Label>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Calculator;