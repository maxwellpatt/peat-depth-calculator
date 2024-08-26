'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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

export default function PeatlandDepthCalculator() {
  const [species, setSpecies] = useState<string>("")
  const [volume, setVolume] = useState("")
  const [tolerableDepth, setTolerableDepth] = useState<{ lower: number, upper: number } | null>(null)

  const calculateDepth = () => {
    if (!species || !volume || !(species in woodDensityData)) return

    const volumeInCm3 = parseFloat(volume) * 1000000  // Convert m³ to cm³
    const densityInGPerCm3 = woodDensityData[species]

    // Calculate carbon content (50% of dry mass)
    const carbonContent = volumeInCm3 * densityInGPerCm3 * 0.5

    // Calculate tolerable depth range
    const lowerBoundDepth = carbonContent / 10400
    const upperBoundDepth = carbonContent / 4700

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
            <Label htmlFor="volume">Volume (m³)</Label>
            <Input 
              id="volume" 
              type="number" 
              value={volume} 
              onChange={(e) => setVolume(e.target.value)}
              placeholder="Enter volume from Excel sheet"
            />
          </div>

          {species && species in woodDensityData && (
            <div className="text-sm">
              Wood Density: {woodDensityData[species]} g/cm³
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