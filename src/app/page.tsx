import PeatlandDepthCalculator from '@/components/PeatDepthCalculator'

const authors = "Maxwell and Cap"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-br from-orange-100 to-orange-200">
      <h1 className="text-4xl font-bold mb-8 text-orange-800">Peatland Depth Calculator</h1>
      <PeatlandDepthCalculator />
    </main>
  )
}

