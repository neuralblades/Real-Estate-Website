'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Developer logos
const DEVELOPER_LOGOS = [
  { id: 1, name: 'SOBHA', logo: '/images/developers/sobha.webp', slug: 'sobha' },
  { id: 2, name: 'Nakheel', logo: '/images/developers/nakheel.webp', slug: 'nakheel' },
  { id: 3, name: 'Emaar', logo: '/images/developers/emaar.webp', slug: 'emaar' },
  { id: 4, name: 'Select Group', logo: '/images/developers/select-group.webp', slug: 'select-group' },
  { id: 5, name: 'Ellington Properties', logo: '/images/developers/ellington.webp', slug: 'ellington' },
  { id: 6, name: 'Meraas', logo: '/images/developers/meraas.webp', slug: 'meraas' },
  { id: 7, name: 'Damac', logo: '/images/developers/damac.webp', slug: 'damac-properties' },
  { id: 8, name: 'Binghatti', logo: '/images/developers/binghatti.webp', slug: 'binghatti' },
  { id: 9, name: 'Majid Al Futtaim', logo: '/images/developers/majid.webp', slug: 'majid-al-futtaim' },
  { id: 10, name: 'Dubai Properties', logo: '/images/developers/danube.webp', slug: 'danube-properties' },
];

interface DeveloperLogo {
  id: number;
  name: string;
  logo: string;
  slug: string;
}

const DeveloperPartners: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef<boolean>(false);

  // Duplicate the logos to create a seamless loop
  const allLogos = [...DEVELOPER_LOGOS, ...DEVELOPER_LOGOS];

  // Handle pause on hover
  const handleMouseEnter = () => {
    isPaused.current = true;
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'paused';
    }
  };

  // Handle resume on mouse leave
  const handleMouseLeave = () => {
    isPaused.current = false;
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'running';
    }
  };

  // Add animation keyframes to the document
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <section className="bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="mb-2 text-center">
          <h3 className="text-sm font-medium tracking-wider text-[#a49650]">
            Partners with Dubai&apos;s leading developers
          </h3>
        </div>

        <div className="relative overflow-hidden">
          <div 
            ref={marqueeRef}
            className="flex"
            style={{
              animation: 'marquee 30s linear infinite',
              width: 'fit-content'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {allLogos.map((developer: DeveloperLogo, index) => (
              <div
                key={`${developer.id}-${index}`}
                className="flex-shrink-0 px-6"
              >
                <Link
                  href={`/developers/${developer.slug}`}
                  className="mx-auto block px-4 py-2 grayscale transition-all duration-300 hover:grayscale-0"
                >
                  <div className="relative h-16 w-32">
                    <Image
                      src={developer.logo}
                      alt={developer.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperPartners;
