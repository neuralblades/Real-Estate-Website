'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get admin user ID
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'admin' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const adminId = adminUser.length > 0 ? adminUser[0].id : 1; // Default to ID 1 if no admin found
    
    // Add sample blog posts
    await queryInterface.bulkInsert('blog_posts', [
      {
        title: 'Top 10 Luxury Properties in Miami',
        slug: 'top-10-luxury-properties-miami',
        content: `<p>Miami has long been known for its stunning beaches, vibrant culture, and luxurious lifestyle. The city's real estate market reflects this opulence, with some of the most breathtaking properties in the world.</p>
        
        <p>In this article, we'll explore the top 10 luxury properties currently available in Miami, from waterfront mansions to penthouse apartments with panoramic views.</p>
        
        <h2>1. Oceanfront Estate in Miami Beach</h2>
        <p>This magnificent estate offers 12,000 square feet of living space, with 8 bedrooms, 10 bathrooms, and 150 feet of private beach frontage. The property features a resort-style pool, private dock, and state-of-the-art smart home technology.</p>
        
        <h2>2. Penthouse at Four Seasons Residences</h2>
        <p>Located in the heart of Brickell, this penthouse offers 360-degree views of the city and Biscayne Bay. With 5 bedrooms and 6.5 bathrooms spread across 8,500 square feet, this residence defines luxury urban living.</p>
        
        <h2>3. Star Island Mansion</h2>
        <p>This iconic Star Island property sits on 1.5 acres with 240 feet of water frontage. The 15,000 square foot mansion includes 10 bedrooms, 12 bathrooms, a private tennis court, and a yacht dock that can accommodate vessels up to 100 feet.</p>`,
        excerpt: 'Discover the most exclusive and luxurious properties currently on the market in Miami, from waterfront estates to stunning penthouses with panoramic views.',
        featuredImage: 'miami-luxury-home.jpg',
        category: 'Luxury Properties',
        tags: ['Miami', 'Luxury', 'Waterfront', 'Penthouses'],
        status: 'published',
        authorId: adminId,
        viewCount: 245,
        publishedAt: new Date('2025-04-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Real Estate Investment Strategies for 2025',
        slug: 'real-estate-investment-strategies-2025',
        content: `<p>As we move through 2025, the real estate investment landscape continues to evolve, presenting both challenges and opportunities for investors. Understanding the current market trends and developing effective strategies is crucial for success in this dynamic environment.</p>
        
        <p>In this comprehensive guide, we'll explore the most promising real estate investment strategies for 2025, taking into account economic forecasts, demographic shifts, and emerging market trends.</p>
        
        <h2>1. Focus on Secondary Markets</h2>
        <p>While primary markets like New York and San Francisco have traditionally been safe bets for real estate investors, secondary markets are increasingly offering better returns. Cities like Austin, Nashville, and Raleigh are experiencing significant population growth, job creation, and economic development, making them attractive options for investors.</p>
        
        <h2>2. Embrace Sustainable and Smart Properties</h2>
        <p>Sustainability is no longer just a buzzword—it's becoming a key factor in property valuation. Properties with green certifications, energy-efficient features, and smart home technology are commanding premium prices and experiencing faster appreciation. Investing in sustainable properties or upgrading existing ones with eco-friendly features can yield substantial returns.</p>
        
        <h2>3. Consider Build-to-Rent Developments</h2>
        <p>The build-to-rent sector is experiencing unprecedented growth as more people choose to rent rather than buy. These purpose-built rental communities offer amenities and features specifically designed for long-term renters, providing investors with stable cash flow and strong appreciation potential.</p>`,
        excerpt: 'Explore the most effective real estate investment strategies for 2025, from emerging markets to innovative property types that promise strong returns in the current economic climate.',
        featuredImage: 'investment-strategy.jpg',
        category: 'Investment',
        tags: ['Investment', 'Strategy', '2025', 'Market Trends'],
        status: 'published',
        authorId: adminId,
        viewCount: 189,
        publishedAt: new Date('2025-03-25'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'How to Prepare Your Home for Sale: Maximizing Value',
        slug: 'prepare-home-for-sale-maximizing-value',
        content: `<p>Selling your home is a significant financial transaction, and proper preparation can make a substantial difference in the final sale price. In today's competitive real estate market, presenting your property in the best possible light is essential for attracting serious buyers and securing top dollar.</p>
        
        <p>This guide will walk you through the most effective steps to prepare your home for sale, focusing on improvements that offer the highest return on investment.</p>
        
        <h2>1. Start with a Deep Clean</h2>
        <p>Before making any improvements, start with a thorough cleaning of your entire home. This includes carpets, windows, grout, appliances, and often-overlooked areas like baseboards and ceiling fans. A spotlessly clean home creates a positive first impression and suggests to buyers that the property has been well-maintained.</p>
        
        <h2>2. Declutter and Depersonalize</h2>
        <p>Removing excess furniture, personal items, and clutter makes spaces appear larger and helps potential buyers envision themselves living in the home. Consider renting a storage unit for items you want to keep but don't need immediate access to during the selling process.</p>
        
        <h2>3. Make Strategic Repairs and Upgrades</h2>
        <p>Not all home improvements offer equal returns. Focus on addressing visible issues that might raise red flags during inspections, such as leaky faucets, cracked tiles, or damaged flooring. For upgrades, prioritize kitchens and bathrooms, as these areas typically provide the highest return on investment.</p>`,
        excerpt: 'Learn the most effective strategies to prepare your home for sale, from cost-effective improvements to staging techniques that can significantly increase your property's market value.',
        featuredImage: 'home-staging.jpg',
        category: 'Selling Tips',
        tags: ['Selling', 'Home Preparation', 'Staging', 'Value'],
        status: 'published',
        authorId: adminId,
        viewCount: 312,
        publishedAt: new Date('2025-04-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Rise of Smart Homes: Technology Transforming Real Estate',
        slug: 'rise-of-smart-homes-technology-transforming-real-estate',
        content: `<p>Smart home technology is revolutionizing the real estate industry, changing how we interact with our living spaces and influencing property values. From automated lighting systems to advanced security features, these technologies are becoming increasingly important factors in home buying decisions.</p>
        
        <p>In this article, we'll explore the latest smart home trends and their impact on the real estate market.</p>
        
        <h2>1. Integrated Home Systems</h2>
        <p>Modern smart homes feature centralized systems that control multiple aspects of the home environment. These integrated platforms allow homeowners to manage lighting, climate, security, and entertainment through a single interface, often accessible via smartphone or voice commands.</p>
        
        <h2>2. Energy Management Solutions</h2>
        <p>Smart thermostats, energy-efficient appliances, and automated lighting systems are not only convenient but also offer significant cost savings. Properties equipped with these technologies are increasingly attractive to environmentally conscious buyers and those looking to reduce utility expenses.</p>
        
        <h2>3. Advanced Security Features</h2>
        <p>From doorbell cameras to comprehensive security systems with remote monitoring capabilities, smart security features provide peace of mind and add considerable value to properties. These systems often include motion sensors, automated locks, and real-time alerts to homeowners' devices.</p>`,
        excerpt: 'Discover how smart home technology is transforming the real estate market, adding value to properties and changing buyer expectations in an increasingly connected world.',
        featuredImage: 'smart-home.jpg',
        category: 'Home Improvement',
        tags: ['Smart Homes', 'Technology', 'Innovation', 'Property Value'],
        status: 'published',
        authorId: adminId,
        viewCount: 178,
        publishedAt: new Date('2025-04-05'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Understanding the 2025 Real Estate Market Forecast',
        slug: 'understanding-2025-real-estate-market-forecast',
        content: `<p>As we navigate through 2025, the real estate market continues to evolve in response to economic conditions, demographic shifts, and changing consumer preferences. Understanding these trends is essential for buyers, sellers, and investors making important property decisions.</p>
        
        <p>This comprehensive analysis examines the key factors shaping the real estate landscape in 2025 and provides insights into what we can expect in the coming months.</p>
        
        <h2>1. Interest Rate Trends</h2>
        <p>After the fluctuations of recent years, interest rates have begun to stabilize in 2025. The Federal Reserve's monetary policy has aimed to balance economic growth with inflation control, resulting in more predictable mortgage rates. This stability is encouraging more buyers to enter the market, particularly first-time homebuyers who had previously been sidelined.</p>
        
        <h2>2. Housing Supply and Demand</h2>
        <p>The housing shortage that characterized the early 2020s is gradually easing as construction activity increases and more existing homeowners decide to list their properties. However, demand remains strong in many markets, particularly for affordable and mid-priced homes, maintaining upward pressure on prices in desirable locations.</p>
        
        <h2>3. Regional Market Variations</h2>
        <p>The national real estate market is increasingly fragmented, with significant variations between regions. While some coastal markets are experiencing moderate price growth, many inland cities and suburban areas continue to see robust appreciation due to migration patterns and relative affordability.</p>`,
        excerpt: 'Get expert insights into the 2025 real estate market outlook, including interest rate projections, supply and demand dynamics, and regional trends affecting property values.',
        featuredImage: 'market-forecast.jpg',
        category: 'Market Trends',
        tags: ['Market Forecast', '2025', 'Trends', 'Analysis'],
        status: 'published',
        authorId: adminId,
        viewCount: 267,
        publishedAt: new Date('2025-03-18'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('blog_posts', null, {});
  }
};
