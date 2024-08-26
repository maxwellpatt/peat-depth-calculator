'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const woodDensities = {
  pine: 0.51,
  spruce: 0.45,
  birch: 0.67
}

const yieldClasses = {
  pine: [4, 6, 8, 10, 12, 14],
  spruce: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
  birch: [4, 6, 8, 10, 12]
}

export default function PeatlandDepthCalculator() {
    const [species, setSpecies] = useState<keyof typeof woodDensities | "">("")
    const [yieldClass, setYieldClass] = useState("")
    const [volume, setVolume] = useState("")
    const [tolerableDepth, setTolerableDepth] = useState<{ lower: number, upper: number } | null>(null)
    const [woodDensity, setWoodDensity] = useState<number | null>(null)  // Add this line
  
    useEffect(() => {
        if (species) {
            setWoodDensity(woodDensities[species as keyof typeof woodDensities])
            setYieldClass("")
            setVolume("")
          }
    }, [species])
  
    const calculateDepth = () => {
      if (!species || !yieldClass || !volume) return
  
      const volumeInCm3 = parseFloat(volume) * 1000000  // Convert m³ to cm³
      const woodDensityValue = woodDensities[species]
  
      const lowerBoundCarbon = (volumeInCm3 * woodDensityValue * 0.5) / 4700
      const upperBoundCarbon = (volumeInCm3 * woodDensityValue * 0.5) / 10400
  
      setTolerableDepth({ lower: lowerBoundCarbon, upper: upperBoundCarbon })
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
              disabled={!species || !yieldClass}
            />
          </div>

          <Button 
            type="button" 
            onClick={calculateDepth} 
            className="w-full"
            disabled={!species || !yieldClass || !volume}
          >
            Calculate Depth
          </Button>
        </form>

        {tolerableDepth !== null && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-center">
              Tolerable Peat Depth: <br />
              Lower Bound: <span className="font-bold">{tolerableDepth.lower.toFixed(2)} cm</span> <br />
              Upper Bound: <span className="font-bold">{tolerableDepth.upper.toFixed(2)} cm</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}