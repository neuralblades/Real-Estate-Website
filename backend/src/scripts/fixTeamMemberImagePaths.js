const { TeamMember } = require('../models');

/**
 * Script to fix team member image paths in the database
 * This script updates all team member records with incorrect image paths
 */
const fixTeamMemberImagePaths = async () => {
  try {
    console.log('Starting to fix team member image paths...');
    
    // Get all team members
    const teamMembers = await TeamMember.findAll();
    console.log(`Found ${teamMembers.length} team members`);
    
    let updatedCount = 0;
    
    // Update each team member with incorrect image path
    for (const member of teamMembers) {
      if (member.image && member.image.includes('C:')) {
        // Extract the relative path
        const pathParts = member.image.split('uploads');
        if (pathParts.length > 1) {
          const newPath = `/uploads${pathParts[1].replace(/\\/g, '/')}`;
          
          console.log(`Updating team member ${member.id} (${member.name})`);
          console.log(`  Old path: ${member.image}`);
          console.log(`  New path: ${newPath}`);
          
          // Update the record
          member.image = newPath;
          await member.save();
          
          updatedCount++;
        }
      }
    }
    
    console.log(`Updated ${updatedCount} team members`);
    console.log('Done!');
    
  } catch (error) {
    console.error('Error fixing team member image paths:', error);
  }
};

// Run the script
fixTeamMemberImagePaths();
