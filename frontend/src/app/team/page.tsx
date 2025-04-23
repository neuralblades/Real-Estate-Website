'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { getTeamMembers, TeamMember } from '@/services/teamService';

// Removed fallback array as we're now fetching from backend

// Team member card component
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg group relative"
    >
      <div className="relative h-80 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Social icons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <a href={member.social.linkedin} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-[#a49650] hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a href={member.social.twitter} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-[#a49650] hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
          <a href={member.social.instagram} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-[#a49650] hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
        <p className="text-[#a49650] font-medium mb-3">{member.role}</p>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${member.email}`} className="text-gray-700 hover:text-teal-600 transition-colors">{member.email}</a>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${member.phone}`} className="text-gray-700 hover:text-teal-600 transition-colors">{member.phone}</a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {member.specialties.map((specialty, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{specialty}</span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="accent"
            size="sm"
            gradient={true}
            className="w-full"
          >
            Contact {member.name.split(' ')[0]}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await getTeamMembers();
        if (response.success) {
          setTeamMembers(response.teamMembers);
        } else {
          setError(response.message || 'Failed to fetch team members');
          // No fallback data needed as we're using an empty array
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('An error occurred while fetching team members');
        // No fallback data needed as we're using an empty array
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Filter for leadership team
  const leadershipTeam = teamMembers.filter(member => member.isLeadership);

  // Filter for other team members
  const otherTeamMembers = teamMembers.filter(member => !member.isLeadership);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  if (error && teamMembers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button
            href="/"
            variant="primary"
            gradient={true}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-500 to-gray-900 text-white py-32">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Meet Our Team</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#a49650] to-[#877b42] mx-auto mb-8"></div>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Our experienced professionals are dedicated to providing exceptional service and finding the perfect property for you.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full mb-4">Our Leaders</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Leadership Team</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-teal-800 mx-auto mb-8"></div>
            <p className="text-gray-700 leading-relaxed">
              Meet the experienced professionals who lead our company to success and ensure we deliver exceptional service to our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Quote Section */}
      <section className="py-20 bg-gradient-to-r from-gray-700 to-gray-900 text-white relative">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <svg className="w-12 h-12 text-[#a49650] mx-auto mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-2xl md:text-3xl font-light italic mb-8 leading-relaxed">
              &quot;Our team is committed to understanding each client&apos;s unique needs and preferences, ensuring a personalized and seamless real estate experience.&quot;
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                {leadershipTeam.length > 0 ? (
                  <Image
                    src={leadershipTeam[0].image}
                    alt={leadershipTeam[0].name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 flex items-center justify-center text-gray-500">
                    CEO
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="font-bold">{leadershipTeam.length > 0 ? leadershipTeam[0].name : 'Our CEO'}</p>
                <p className="text-gray-300 text-sm">{leadershipTeam.length > 0 ? leadershipTeam[0].role : 'Chief Executive Officer'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Team Members Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 text-sm font-semibold text-teal-800 bg-teal-100 rounded-full mb-4">Our Experts</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Specialists</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-teal-800 mx-auto mb-8"></div>
            <p className="text-gray-700 leading-relaxed">
              Our team of specialists brings diverse expertise to ensure all your real estate needs are met with excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {otherTeamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block px-3 py-1 text-sm font-semibold text-teal-800 bg-white rounded-full mb-4">Careers</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Team</h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  We&apos;re always looking for talented individuals who are passionate about real estate and committed to providing exceptional service to clients.
                </p>
                <Button
                  href="/careers"
                  variant="primary"
                  size="lg"
                  gradient={true}
                  className="font-medium"
                >
                  View Open Positions
                </Button>
              </div>
              <div className="relative h-64 md:h-full rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#e9ddb0] to-[#a49650] text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Our Team?</h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Contact us today to connect with one of our real estate experts and start your property journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              href="/properties"
              variant="primary"
              size="lg"
              gradient={true}
              className="font-bold shadow-lg"
            >
              Browse Properties
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="bg-white font-bold shadow-lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
