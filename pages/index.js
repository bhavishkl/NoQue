import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default function Home({ session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  if (session) {
    if (typeof window !== 'undefined') {
      router.push('/user/home')
    }
    return null
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>QueueMaster - Revolutionizing Queue Management</title>
        <meta name="description" content="QueueMaster: The ultimate marketplace for queue management solutions" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="bg-gradient-to-r from-purple-600 to-indigo-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="#" className="text-white font-bold text-xl">QueueMaster</a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
                <a href="#pricing" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
              </div>
            </div>
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white hover:text-gray-300 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">How It Works</a>
                <a href="#pricing" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Revolutionize Your Queue Management
            </h1>
            <p className="mt-6 text-lg sm:text-xl max-w-3xl">
              QueueMaster connects businesses with cutting-edge queue management solutions. Streamline operations, enhance customer experience, and boost efficiency.
            </p>
            <div className="mt-10">
              <Link href="/signup" className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-md text-lg font-medium inline-block">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Key Features</h2>
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Real-time Analytics</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Monitor queue performance and customer flow in real-time.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Multi-channel Integration</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Seamlessly integrate with various platforms and devices.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Advanced Security</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Ensure data protection and compliance with industry standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">How It Works</h2>
            <div className="mt-10">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <Image src="/queue-illustration.svg" alt="Queue management illustration" width={500} height={400} layout="responsive" />
                </div>
                <div className="md:w-1/2 md:pl-10">
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="text-base sm:text-lg text-gray-700">Sign up and create your account</li>
                    <li className="text-base sm:text-lg text-gray-700">Choose from our range of queue management solutions</li>
                    <li className="text-base sm:text-lg text-gray-700">Integrate the solution with your existing systems</li>
                    <li className="text-base sm:text-lg text-gray-700">Start managing queues efficiently and improve customer satisfaction</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Pricing Plans</h2>
            <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
              {[
                { name: 'Basic', price: '$29', features: ['Up to 100 daily queue entries', 'Basic analytics', 'Email support'] },
                { name: 'Pro', price: '$79', features: ['Up to 1000 daily queue entries', 'Advanced analytics', 'Priority support'] },
                { name: 'Enterprise', price: 'Custom', features: ['Unlimited queue entries', 'Custom integrations', 'Dedicated account manager'] },
              ].map((plan) => (
                <div key={plan.name} className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </p>
                    <ul className="mt-6 space-y-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex">
                          <svg className="h-6 w-6 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-3 text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="#" className="bg-indigo-500 text-white mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium">
                    Get started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2023 QueueMaster. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {
  const start = performance.now()
  const supabase = createPagesServerClient(context)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const end = performance.now()
  console.log(`SSR took ${(end - start).toFixed(2)} ms`)

  return {
    props: {
      session,
    },
  }
}