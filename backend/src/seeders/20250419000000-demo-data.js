'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create agent user
    const agentPassword = await bcrypt.hash('agent123', 10);
    const agents = await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: agentPassword,
          phone: '(555) 123-4567',
          role: 'agent',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: agentPassword,
          phone: '(555) 987-6543',
          role: 'agent',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    // Create properties
    await queryInterface.bulkInsert('Properties', [
      {
        title: 'Luxury Penthouse with Ocean View',
        description:
          'Experience the epitome of luxury living in this stunning penthouse with breathtaking ocean views. This exquisite property features high ceilings, floor-to-ceiling windows, and a spacious open floor plan perfect for entertaining.',
        price: 2500000,
        location: 'Miami Beach, FL',
        address: '123 Ocean Drive',
        city: 'Miami Beach',
        state: 'FL',
        zipCode: '33139',
        propertyType: 'apartment',
        status: 'for-sale',
        bedrooms: 3,
        bathrooms: 3.5,
        area: 2800,
        yearBuilt: 2018,
        features: [
          'Ocean View',
          'Private Terrace',
          'Floor-to-ceiling Windows',
          'Gourmet Kitchen',
          'Walk-in Closets',
          'Smart Home Technology',
          'Concierge Service',
        ],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop',
        ],
        mainImage:
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
        featured: true,
        agentId: agents[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Modern Villa with Private Pool',
        description:
          'Indulge in the ultimate luxury lifestyle in this modern villa featuring a private pool, expansive outdoor living spaces, and state-of-the-art amenities. This architectural masterpiece offers the perfect blend of comfort and sophistication.',
        price: 1800000,
        location: 'Beverly Hills, CA',
        address: '456 Luxury Lane',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        propertyType: 'house',
        status: 'for-sale',
        bedrooms: 5,
        bathrooms: 4,
        area: 4200,
        yearBuilt: 2020,
        features: [
          'Private Pool',
          'Home Theater',
          'Wine Cellar',
          'Outdoor Kitchen',
          'Smart Home System',
          'Spa-like Bathrooms',
          'Landscaped Garden',
        ],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
        ],
        mainImage:
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
        featured: true,
        agentId: agents[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Elegant Apartment in Downtown',
        description:
          'Discover urban sophistication in this elegant downtown apartment featuring premium finishes, an open concept layout, and stunning city views. Located in the heart of the city, this property offers the perfect blend of luxury and convenience.',
        price: 950000,
        location: 'New York, NY',
        address: '789 Urban Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        propertyType: 'apartment',
        status: 'for-sale',
        bedrooms: 2,
        bathrooms: 2,
        area: 1500,
        yearBuilt: 2019,
        features: [
          'City Views',
          'Hardwood Floors',
          'Stainless Steel Appliances',
          'Fitness Center',
          'Rooftop Terrace',
          'Doorman',
          'Pet Friendly',
        ],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',
        ],
        mainImage:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        featured: true,
        agentId: agents[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Properties', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
