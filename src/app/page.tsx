import PeatlandDepthCalculator from '@/components/PeatDepthCalculator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Peatland Depth Calculator</h1>
      <PeatlandDepthCalculator />
    </main>
  )
}