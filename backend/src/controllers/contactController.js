// Simplified controller without email and WhatsApp notifications

// @desc    Submit contact form (simplified without notifications)
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Log the submission for development purposes
    console.log(`New contact form submission from ${firstName} ${lastName}`);
    
    // In a production environment, you would store this in a database
    // For now, we'll just return success
    
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  submitContactForm,
};
