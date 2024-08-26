'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PeatlandDepthCalculator() {
  const [species, setSpecies] = useState("")
  const [yieldClass, setYieldClass] = useState("")
  const [volume, setVolume] = useState("")
  const [woodDensity, setWoodDensity] = useState("")
  const [tolerableDepth, setTolerableDepth] = useState<{ lower: number, upper: number } | null>(null)

  const calculateDepth = () => {
    if (!species || !yieldClass || !volume || !woodDensity) return

    const volumeInCm3 = parseFloat(volume)
    const woodDensityValue = parseFloat(woodDensity)

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
            <Select onValueChange={setYieldClass}>
              <SelectTrigger id="yieldClass">
                <SelectValue placeholder="Select yield class" />
              </SelectTrigger>
              <SelectContent>
                {[4, 6, 8, 10, 12, 14].map(yc => (
                  <SelectItem key={yc} value={yc.toString()}>{yc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume">Volume (cm³)</Label>
            <Input id="volume" type="number" value={volume} onChange={(e) => setVolume(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="woodDensity">Wood Density (g/cm³)</Label>
            <Input id="woodDensity" type="number" value={woodDensity} onChange={(e) => setWoodDensity(e.target.value)} />
          </div>
          
          <Button type="button" onClick={calculateDepth} className="w-full">
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