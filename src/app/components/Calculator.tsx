import React, { useState, useEffect } from 'react';
import { calculateAll } from '@/utils/calc';
import { UnitType } from '@/utils/calc';
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const units: UnitType[] = ['bushel', 'ton', 'saca'];

const WHEAT_PRICE = 80; // Fixed wheat price in R$ per ton



const toFixedNumber = (n: number) => {
    return Number(n.toFixed(2));
}

const unitNames: { [key in UnitType]: string } = {
    bushel: 'Libra',
    ton: 'Tonelada',
    saca: 'Saca',
    real: 'Real',
};

const areaUnits = ['hectare', 'acre', 'km2'];


const Calculator: React.FC = () => {
    const [activeUnit, setActiveUnit] = useState<UnitType>('saca');
    const [activeAreaUnit, setActiveAreaUnit] = useState<string>('hectare');

    const [values, setValues] = useState<{ [key in UnitType]: number }>({
        saca: 1,
        bushel: 0,
        ton: 0,
        real: 0,
    });
    const [areaValues, setAreaValues] = useState<{ [key: string]: number }>({
        hectare: 1,
        acre: 0,
        km2: 0,
    });

    const [expectedSales, setExpectedSales] = useState<number>(0);

    useEffect(() => {
        try {
            const newResults = calculateAll('trigo', activeUnit, values[activeUnit]);

            setValues(newResults);
            setExpectedSales(values[activeUnit] * WHEAT_PRICE);

        } catch (error) {
            console.error(error);
        }
    }, [activeUnit, values]);

    const handleInputChange = (unit: UnitType, value: number) => {
        setActiveUnit(unit);
        setValues(prev => ({ ...prev, [unit]: value }));

    };

    const renderQuotations = () => (
        <div className="space-y-2">
            <Label className="font-bold">Cotações</Label>
            <div className="grid grid-cols-3 gap-2">
                {units.map((unit) => (
                    <div key={`quotation-${unit}`} className="space-y-1">
                        <Label className="text-xs text-gray-600">{unitNames[unit]}</Label>
                        <div className="bg-gray-100 p-2 rounded text-sm">
                            R$ {values[unit]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderUnitConverter = () => (
        <div className="space-y-2">
            <Label className="font-bold">Quantidades</Label>
            <div className="grid grid-cols-3 gap-2">
                {units.map((unit) => (
                    <div key={`converter-${unit}`} className="space-y-1">
                        <Label className="text-xs text-gray-600">{unitNames[unit]}</Label>
                        <Input
                            type="number"
                            value={values[unit]}
                            onChange={(e) => handleInputChange(unit, Number(e.target.value))}
                            className={activeUnit === unit ? "bg-green-100" : "focus:bg-yellow-100"}


                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const handleAreaChange = (unit: string, value: number) => {

        const newValues = { ...areaValues, [unit]: value };
        if (unit === 'hectare') {
            newValues.acre = toFixedNumber(value * 2.47105);
            newValues.km2 = toFixedNumber(value * 0.01);
        } else if (unit === 'acre') {
            newValues.hectare = toFixedNumber(value * 0.404686);
            newValues.km2 = toFixedNumber(value * 0.00404686);
        } else if (unit === 'km2') {
            newValues.hectare = toFixedNumber(value * 100);
            newValues.acre = toFixedNumber(value * 247.105);
        }
        setAreaValues(newValues);
        setActiveAreaUnit(unit);
        console.log(newValues[unit], unit, values[activeUnit], activeUnit)

    };
    const calculateProductivity = (
        area: number,
        production: number
    ): number => {
        // Convert area to hectares if necessary

        // Calculate total production
        const productivity = production / area;

        // Round to two decimal places
        return Number(productivity.toFixed(2))
    };

    const calculateProductivityValues = () => {
        const sacaPerHectare = calculateProductivity(areaValues.hectare, values.saca);
        const tonPerHectare = calculateProductivity(areaValues.hectare, values.ton);
        const reaisPerHectare = sacaPerHectare * WHEAT_PRICE;

        return {
            sacaPerHectare: toFixedNumber(sacaPerHectare),
            tonPerHectare: toFixedNumber(tonPerHectare),
            reaisPerHectare: toFixedNumber(reaisPerHectare)
        };
    };

    const renderProductivity = () => {
        const productivityValues = calculateProductivityValues();
        return (
            <div className="space-y-2">
                <Label className="font-bold">Produtividade</Label>
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Saca/Hectare</Label>
                        <div className="bg-gray-100 p-2 rounded text-sm">
                            {productivityValues.sacaPerHectare}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Ton/Hectare</Label>
                        <div className="bg-gray-100 p-2 rounded text-sm">
                            {productivityValues.tonPerHectare}
                        </div>

                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-600">R$/Hectare</Label>
                        <div className="bg-gray-100 p-2 rounded text-sm">
                            {productivityValues.reaisPerHectare}
                        </div>

                    </div>
                </div>
            </div>
        );
    };





    const renderAreaConverter = () => {
        return <div className="space-y-2">
            <Label className="font-bold">Conversor de Área</Label>
            <div className="grid grid-cols-3 gap-2">
                {areaUnits.map((unit) => (
                    <div key={`area-${unit}`} className="space-y-1">
                        <Label className="text-xs text-gray-600">{unit}</Label>
                        <Input
                            type="number"
                            value={areaValues[unit]}
                            onChange={(e) => handleAreaChange(unit, Number(e.target.value))}
                            className={activeAreaUnit === unit ? "bg-green-100" : "focus:bg-yellow-100"}
                        />
                    </div>
                ))}
            </div>
        </div>;
    }

    return (
        <div className="flex justify-center items-center bg-gray-100 p-4">
            <Card className="max-w-[360px] w-full bg-white rounded-3xl overflow-hidden shadow-xl">
                <div className="bg-[#F4A460] p-4 text-white flex items-center space-x-2">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <span className="font-bold">JPA AGRO</span>
                </div>
                <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                            </svg>
                            <span>Cotação Trigo</span>
                        </div>
                        <span className="font-bold">R$ {WHEAT_PRICE}</span>
                    </div>

                    {renderQuotations()}
                    {renderAreaConverter()}

                    {renderUnitConverter()}
                    {renderProductivity()}

                    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">

                        <div className="space-y-6">

                            <div className="text-center">
                                <p className=" font-medium text-gray-600 mb-2">
                                    Valor Total Estimado
                                </p>
                                <div className="text-2xl font-bold text-green-600">
                                    R$ {expectedSales.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>


                </CardContent>
            </Card>
        </div>
    );
};

export default Calculator;
