'use client';

import api from './api';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message?: string;
}

// Submit contact form
export const submitContactForm = async (formData: ContactFormData): Promise<ContactFormResponse> => {
  try {
    // First try to submit to the backend API
    try {
      const response = await api.post('/contact', formData);
      return response.data;
    } catch (apiError) {
      console.error('API error:', apiError);

      // If the API fails, use the fallback method (email.js or similar)
      // This ensures the form still works even if the backend is not available
      const fallbackResponse = await sendContactFormFallback(formData);
      return fallbackResponse;
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Fallback method using localStorage (in a real app, you'd use a service like EmailJS)
const sendContactFormFallback = async (formData: ContactFormData): Promise<ContactFormResponse> => {
  try {
    // Store in localStorage as a fallback
    const existingForms = JSON.parse(localStorage.getItem('contactForms') || '[]');
    const newForm = {
      ...formData,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // Add the new form to the existing forms
    existingForms.push(newForm);

    // Save to localStorage
    localStorage.setItem('contactForms', JSON.stringify(existingForms));

    // Debug log
    console.log('Contact form saved to localStorage:', newForm);
    console.log('Total forms in localStorage:', existingForms.length);

    // In a real app, you would use a service like EmailJS here
    // For example:
    // await emailjs.send(
    //   'service_id',
    //   'template_id',
    //   formData,
    //   'user_id'
    // );

    return {
      success: true,
      message: 'Form submitted successfully via fallback method'
    };
  } catch (error) {
    console.error('Error in fallback method:', error);
    return {
      success: false,
      message: 'Failed to submit form via fallback method'
    };
  }
};

// Get all contact forms from localStorage (admin only)
export const getContactForms = () => {
  try {
    // Get forms from localStorage
    const forms = JSON.parse(localStorage.getItem('contactForms') || '[]');

    // Debug log
    console.log('Retrieved forms from localStorage:', forms.length);

    // No test data needed anymore as we have the Add Test button in the admin dashboard

    return forms;
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    return [];
  }
};
