'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const yieldClasses = {
  pine: [4, 6, 8, 10, 12, 14],
  spruce: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
  birch: [4, 6, 8, 10, 12]
}

export default function PeatlandDepthCalculator() {
  const [species, setSpecies] = useState<keyof typeof yieldClasses | "">("")
  const [yieldClass, setYieldClass] = useState("")
  const [volume, setVolume] = useState("")
  const [woodDensity, setWoodDensity] = useState("")
  const [tolerableDepth, setTolerableDepth] = useState<{ lower: number, upper: number } | null>(null)

  const calculateDepth = () => {
    if (!species || !yieldClass || !volume || !woodDensity) return

    // User inputs:
    // - volume (m³)
    // - woodDensity (g/cm³)
    // - species (pine, spruce, or birch)
    // - yieldClass (depends on species)

    const volumeInCm3 = parseFloat(volume) * 1000000  // Convert m³ to cm³
    const densityInGPerCm3 = parseFloat(woodDensity)

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
            <Select onValueChange={(value) => setSpecies(value as keyof typeof yieldClasses)}>
              <SelectTrigger id="species">
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pine">Pine</SelectItem>
                <SelectItem value="spruce">Spruce</SelectItem>
                <SelectItem value="birch">Birch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yieldClass">Yield Class</Label>
            <Select onValueChange={setYieldClass} disabled={!species}>
              <SelectTrigger id="yieldClass">
                <SelectValue placeholder="Select yield class" />
              </SelectTrigger>
              <SelectContent>
                {species && yieldClasses[species].map(yc => (
                  <SelectItem key={yc} value={yc.toString()}>{yc}</SelectItem>
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

          <div className="space-y-2">
            <Label htmlFor="woodDensity">Wood Density (g/cm³)</Label>
            <Input 
              id="woodDensity" 
              type="number" 
              value={woodDensity} 
              onChange={(e) => setWoodDensity(e.target.value)}
              placeholder="Enter wood density"
            />
          </div>

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