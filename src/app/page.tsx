import PeatlandDepthCalculator from '@/components/PeatDepthCalculator'

const authors = "Maxwell and Capucine"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-dead-trees bg-cover bg-center">
      <h1 className="text-4xl font-bold mb-8 text-orange-800">Peatland Depth Calculator</h1>
      <PeatlandDepthCalculator />
    </main>
  )
}

