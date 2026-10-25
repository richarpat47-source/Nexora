import { Hero, Navbar } from './Hero'
import { Benefits, Demo, FAQ, FearQuiz, FinalCTA, Footer, HowItWorks, Marquee, Modules, Pricing, Problem, Stats, Testimonials } from './Sections'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Problem />
        <Benefits />
        <HowItWorks />
        <FearQuiz />
        <Demo />
        <Modules />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
