'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Papa from 'papaparse'

type WoodDensityData = {
  [key: string]: number;
};

const woodDensityData: WoodDensityData = {
  "Corsican Pine": 0.51,
  "Lodgepole Pine": 0.47,
  "Sitka Spruce": 0.42,
  "Norway Spruce": 0.41,
  "European Larch": 0.58,
  "Japanese Larch": 0.5,
  "Hybrid Larch": 0.451,
  "Douglas Fir": 0.51,
  "Western Hemlock": 0.47,
  "Western Red Cedar": 0.37,
  "Lawson Cypress": 0.48,
  "Grand Fir": 0.45,
  "Noble Fir": 0.42,
  "Oak": 0.67,
  "Beech": 0.71,
  "Sycamore": 0.55,
  "Ash": 0.68,
  "Birch": 0.62,
  "Poplar": 0.44,
  "Scots Pine": 0.55
};

  type AgeToMaturityData = {
    [species: string]: {
      [yieldClass: string]: number;
    };
  };
  
  interface TreeData {
    'Tree species': string;
    'Yield class': number;
    'Age': number;
    'Main crop after thinning volume in cubic meters to top diameters of 7cm': number;
    // Add other columns as needed
  }  

  export default function PeatlandDepthCalculator() {
    const [species, setSpecies] = useState<string>("")
    const [yieldClass, setYieldClass] = useState<number>("")
    const [tolerableDepth, setTolerableDepth] = useState<{ lower: number, upper: number } | null>(null)
    const [treeData, setTreeData] = useState<TreeData[]>([]);
    const [ageToMaturityData, setAgeToMaturityData] = useState<AgeToMaturityData>({})
    const [ageToMaturity, setAgeToMaturity] = useState<number | null>(null)
    const [volume, setVolume] = useState<string | null>(null);

    useEffect(() => {
      fetch('/age_to_maturity.csv')
        .then(response => response.text())
        .then(csvString => {
          Papa.parse(csvString, {
            header: true,
            complete: (results) => {
              const data: AgeToMaturityData = {}
              results.data.forEach((row: any) => {
                if (!data[row.Species]) {
                  data[row.Species] = {}
                }
                data[row.Species][row['Yield class']] = parseInt(row['Age to maturity'])
              })
              setAgeToMaturityData(data)
            }
          })
        })
    }, [])

    useEffect(() => {
      if (species && yieldClass && ageToMaturityData[species] && ageToMaturityData[species][yieldClass]) {
        setAgeToMaturity(ageToMaturityData[species][yieldClass])
      } else {
        setAgeToMaturity(null)
      }
    }, [species, yieldClass, ageToMaturityData])

    useEffect(() => {
      // Load and parse the CSV file
      fetch('/tree_yield_data.csv')
        .then(response => response.text())
        .then(csvString => {
          const result = Papa.parse<TreeData>(csvString, { header: true });
          setTreeData(result.data);
        });
    }, []);

    useEffect(() => {
      if (species && yieldClass && ageToMaturity !== null) {
        const matchingRow = treeData.find(row => 
          row['Tree species'] === species &&
          row['Yield class'] === yieldClass &&
          parseInt(row['Age']) === ageToMaturity
        );

        if (matchingRow) {
          setVolume(matchingRow['Main crop after thinning volume in cubic meters to top diameters of 7cm']);
        } else {
          setVolume(null);
        }
      }
    }, [species, yieldClass, ageToMaturity, treeData]);

    const calculateDepth = () => {
      if (!species || !volume || !(species in woodDensityData)) return

      const densityInGPerCm3 = woodDensityData[species]

    // Calculate carbon content (50% of dry mass) (tonne * 1000 to convert to kg)
    const carbonContent = volume * densityInGPerCm3 * 0.5

      // Calculate tolerable depth range
      const lowerBoundDepth = carbonContent / 10.4
      const upperBoundDepth = carbonContent / 4.7

      setTolerableDepth({ lower: lowerBoundDepth, upper: upperBoundDepth })
    }

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Peatland Depth Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select onValueChange={setSpecies}>
                <SelectTrigger id="species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(woodDensityData).map(species => (
                    <SelectItem key={species} value={species}>
                      {species}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yieldClass">Yield Class</Label>
              <Input 
                id="yieldClass" 
                type="number" 
                value={yieldClass} 
                onChange={(e) => setYieldClass(e.target.value)}
                placeholder="Enter yield class"
              />
            </div>
  
            {species && species in woodDensityData && (
              <div className="text-sm">
                Wood Density: {woodDensityData[species]} g/cm³
              </div>
            )}
  
            {ageToMaturity !== null && (
              <div className="text-sm">
                Age to Maturity: {ageToMaturity} years
              </div>
            )}

            {volume !== null && (
              <div className="text-sm">
                Volume at Maturity: {volume} m³
              </div>
            )}
  
            <Button type="button" onClick={calculateDepth}>Calculate</Button>
          </form>
  
          {tolerableDepth && (
            <div className="mt-4">
              <p>Lower Bound Depth: {tolerableDepth.lower.toFixed(2)} cm</p>
              <p>Upper Bound Depth: {tolerableDepth.upper.toFixed(2)} cm</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }