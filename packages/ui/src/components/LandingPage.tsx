import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export interface LandingPageProps {
  className?: string;
}

export function LandingPage({ className }: LandingPageProps) {
  return (
    <div className={clsx('min-h-screen bg-white text-gray-900', className)}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-900 text-white font-bold">
            OFM
          </div>
          <span className="text-xl font-semibold">OpenFM</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/player"
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            Open the Player
          </Link>
          <button className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
            Install
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight text-gray-900">
                Mood-based music for your stream.
              </h1>
              <p className="text-lg text-gray-600">
                A modern OBS dock that crossfades smoothly, keeps artwork beautiful, and lets your voice and alerts sit on top when it matters.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/player"
                  className="rounded-lg bg-gray-900 px-8 py-3 text-base font-medium text-white transition hover:bg-gray-800"
                >
                  Install OpenFM
                </Link>
                <Link
                  to="/player"
                  className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-900 transition hover:bg-gray-50"
                >
                  Open the Player
                </Link>
              </div>
            </div>

            {/* Right: Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&q=80"
                alt="Vintage microphone in recording studio"
                className="aspect-square rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&q=80"
                alt="Acoustic guitar in sunlit room"
                className="aspect-square rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80"
                alt="Modern living room with cozy atmosphere"
                className="aspect-square rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&q=80"
                alt="Person typing on laptop"
                className="aspect-square rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section 1 */}
      <section className="px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-2 text-sm uppercase tracking-wider text-gray-500">TWO WAYS TO PLAY</p>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Local Mood Packs or Suno Library</h2>
              <p className="text-lg text-gray-600">
                Install curated ZIP packs once and play offline, or paste your Suno API key and browse cover-art rich tracks. Switching is one click.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&q=80"
                alt="Person at concert with raised arms"
                className="aspect-square rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&q=80"
                alt="Desert road stretching into distance"
                className="aspect-square rounded-2xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop&q=80"
                alt="Stack of old books in library"
                className="aspect-square rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section 2 */}
      <section className="px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80"
                alt="Person with headphones enjoying music"
                className="aspect-[4/3] rounded-2xl object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="mb-2 text-sm uppercase tracking-wider text-gray-500">SMOOTH TRANSITIONS</p>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Silky crossfades, adjustable anytime</h2>
              <p className="mb-6 text-lg text-gray-600">
                Default 250 ms. Slide it where you like. Switching moods or songs always feels polished.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/player"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                >
                  Open the Player
                </Link>
                <button className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
                  Install
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section 3 */}
      <section className="px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-900 text-white font-bold">
                  OFM
                </div>
                <span className="text-xl font-semibold">OpenFM</span>
              </div>
              <p className="mb-2 text-sm uppercase tracking-wider text-gray-500">AUDIO PRIORITY</p>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Your mic and alerts stay on top</h2>
              <p className="text-lg text-gray-600">
                Tick checkboxes for any OBS source to duck OpenFM automatically when needed. When they stop, your music returns.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=600&fit=crop&q=80"
                alt="Close-up of grand piano keys"
                className="aspect-square rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Install OpenFM</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 text-2xl font-bold text-gray-900">1</div>
              <p className="text-gray-600">Download the installer for Windows or macOS.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 text-2xl font-bold text-gray-900">2</div>
              <p className="text-gray-600">Run it, then launch OBS.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 text-2xl font-bold text-gray-900">3</div>
              <p className="text-gray-600">OBS: View → Docks → check OpenFM.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 text-2xl font-bold text-gray-900">4</div>
              <p className="text-gray-600">Click a mood and you're live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">Let the mood lead the stream.</p>
            <div className="flex gap-4">
              <Link
                to="/player"
                className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Install OpenFM
              </Link>
              <Link
                to="/player"
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                Open the Player
              </Link>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold">
              N
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

