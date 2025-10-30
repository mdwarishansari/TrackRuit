export const emailValidator = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const passwordValidator = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const urlValidator = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const phoneValidator = (phone) => {
  const regex = /^[\+]?[1-9][\d]{0,15}$/;
  return regex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const nameValidator = (name) => {
  return name.length >= 2 && name.length <= 50;
};

export const jobTitleValidator = (title) => {
  return title.length >= 2 && title.length <= 100;
};

export const companyValidator = (company) => {
  return company.length >= 2 && company.length <= 100;
};

export const salaryValidator = (salary) => {
  if (!salary) return true; // Optional field
  const regex = /^[\$€£]?[0-9,]+(\.[0-9]{2})?(\s*-\s*[\$€£]?[0-9,]+(\.[0-9]{2})?)?$/;
  return regex.test(salary);
};

export const fileValidator = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  } = options;

  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / 1024 / 1024}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File must be PDF, DOC, or DOCX' };
  }

  return { isValid: true, error: null };
};

export const validateForm = (formData, schema) => {
  const errors = {};

  Object.keys(schema).forEach(field => {
    const validators = schema[field];
    const value = formData[field];

    for (const validator of validators) {
      const result = validator(value, formData);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const required = (fieldName) => (value) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return true;
};

export const minLength = (fieldName, min) => (value) => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return true;
};

export const maxLength = (fieldName, max) => (value) => {
  if (value && value.length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }
  return true;
};

export const isEmail = (value) => {
  if (value && !emailValidator(value)) {
    return 'Please enter a valid email address';
  }
  return true;
};

export const isUrl = (value) => {
  if (value && !urlValidator(value)) {
    return 'Please enter a valid URL';
  }
  return true;
};