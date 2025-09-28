/**
 * Valida que un campo no esté vacío
 * @param {string} value  
 * @param {string} fieldName 
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return {
      isValid: false,
      message: `El campo "${fieldName}" es requerido`
    };
  }
  return { isValid: true, message: "" };
};

/**
 * Valida formato de email
 * @param {string} email
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  const requiredValidation = validateRequired(email, "Email");
  if (!requiredValidation.isValid) {
    return requiredValidation;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Ingresar un formato de email válido (ejemplo@dominio.com)"
    };
  }
  
  return { isValid: true, message: "" };
};

/**
 * Valida la contraseña
 * @param {string} password
 * @param {number} minLength
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password, minLength = 6) => {
  const requiredValidation = validateRequired(password, "Contraseña");
  if (!requiredValidation.isValid) {
    return requiredValidation;
  }
  
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `La contraseña debe tener al menos ${minLength} caracteres`
    };
  }
  
  // Validar que contenga al menos un número
  const hasNumber = /\d/.test(password);
  
  // Validar que contenga al menos una letra
  const hasLetter = /[a-zA-Z]/.test(password);
  
  // Validar que contenga al menos un carácter especial
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  
  if (!hasNumber || !hasLetter || !hasSpecialChar) {
    return {
      isValid: false,
      message: "La contraseña debe ser una combinación de al menos seis números, letras y caracteres especiales (como ! o &)"
    };
  }
  
  return { isValid: true, message: "" };
};

/**
 * Valida que las contraseñas coincidan
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  const requiredValidation = validateRequired(confirmPassword, "Confirmar contraseña");
  if (!requiredValidation.isValid) {
    return requiredValidation;
  }
  
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: "Las contraseñas no coinciden"
    };
  }
  
  return { isValid: true, message: "" };
};

/**
 * Valida formato de teléfono (básico)
 * @param {string} phone
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePhone = (phone) => {
  const requiredValidation = validateRequired(phone, "Teléfono");
  if (!requiredValidation.isValid) {
    return requiredValidation;
  }
  
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      message: "El formato del teléfono no es válido"
    };
  }
  
  if (phone.replace(/\D/g, '').length < 8) {
    return {
      isValid: false,
      message: "El teléfono debe tener al menos 8 dígitos"
    };
  }
  
  return { isValid: true, message: "" };
};

/**
 * Valida múltiples campos y retorna el primer error encontrado
 * @param {Array} validations - Array de objetos de validación
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateMultiple = (validations) => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true, message: "" };
};

/**
 * Validaciones específicas para el formulario de registro
 */
export const validateRegistrationStep1 = (form) => {
  const validations = [
    validateRequired(form.nombre, "Nombre"),
    validateRequired(form.apellido, "Apellido"),
    validatePhone(form.telefono)
  ];
  
  return validateMultiple(validations);
};

export const validateRegistrationStep2 = (form) => {
  const validations = [
    validateEmail(form.email),
    validatePassword(form.password),
    validatePasswordMatch(form.password, form.confirmPassword)
  ];
  
  return validateMultiple(validations);
};

export const validateLogin = (form) => {
  const validations = [
    validateEmail(form.email),
    validateRequired(form.password, "Contraseña")
  ];

  return validateMultiple(validations);
};