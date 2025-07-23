import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { register } from '../store/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    profile: {
      firstName: '',
      lastName: '',
    },
    artistProfile: {
      name: '',
      bio: '',
    },
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear validation error for this field
    setValidationErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Validate field on change only if field has been touched
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      if (Object.keys(fieldErrors).length > 0) {
        setValidationErrors(prev => ({
          ...prev,
          ...fieldErrors
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    const fieldErrors = validateField(name, value);
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        ...fieldErrors
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const allErrors = {};
    
    // Email validation
    const emailErrors = validateField('email', formData.email);
    Object.assign(allErrors, emailErrors);
    
    // Password validation
    const passwordErrors = validateField('password', formData.password);
    Object.assign(allErrors, passwordErrors);
    
    // Confirm password validation
    const confirmPasswordErrors = validateField('confirmPassword', formData.confirmPassword);
    Object.assign(allErrors, confirmPasswordErrors);
    
    // Profile validation
    const firstNameErrors = validateField('profile.firstName', formData.profile.firstName);
    Object.assign(allErrors, firstNameErrors);
    
    const lastNameErrors = validateField('profile.lastName', formData.profile.lastName);
    Object.assign(allErrors, lastNameErrors);
    
    // Artist profile validation
    if (formData.role === 'artist') {
      const artistNameErrors = validateField('artistProfile.name', formData.artistProfile.name);
      Object.assign(allErrors, artistNameErrors);
    }
    
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      return;
    }

    const registrationData = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
      profile: formData.profile,
    };

    if (formData.role === 'artist') {
      registrationData.artistProfile = formData.artistProfile;
    }

    try {
      await dispatch(register(registrationData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      // Handle server validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const serverErrors = {};
        error.errors.forEach(err => {
          if (err.path) {
            serverErrors[err.path] = err.msg;
          }
        });
        setValidationErrors(prev => ({
          ...prev,
          ...serverErrors
        }));
      }
    }
  };

  // Validation helper functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 6;
    
    return {
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasMinLength,
      isValid: hasUpperCase && hasLowerCase && hasNumber && hasMinLength
    };
  };

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          errors.email = 'Please provide a valid email address';
        }
        break;
      
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!value) {
          errors.password = 'Password is required';
        } else if (!passwordValidation.isValid) {
          const requirements = [];
          if (!passwordValidation.hasMinLength) requirements.push('at least 6 characters');
          if (!passwordValidation.hasUpperCase) requirements.push('one uppercase letter');
          if (!passwordValidation.hasLowerCase) requirements.push('one lowercase letter');
          if (!passwordValidation.hasNumber) requirements.push('one number');
          errors.password = `Password must contain ${requirements.join(', ')}`;
        }
        break;
      
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
      
      case 'profile.firstName':
        if (!value || value.trim().length === 0) {
          errors['profile.firstName'] = 'First name is required';
        } else if (value.trim().length > 50) {
          errors['profile.firstName'] = 'First name must be less than 50 characters';
        }
        break;
      
      case 'profile.lastName':
        if (!value || value.trim().length === 0) {
          errors['profile.lastName'] = 'Last name is required';
        } else if (value.trim().length > 50) {
          errors['profile.lastName'] = 'Last name must be less than 50 characters';
        }
        break;
      
      case 'artistProfile.name':
        if (formData.role === 'artist' && (!value || value.trim().length === 0)) {
          errors['artistProfile.name'] = 'Artist name is required';
        }
        break;
      
      default:
        break;
    }
    
    return errors;
  };


  // Clear errors when role changes
  useEffect(() => {
    if (formData.role === 'user') {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['artistProfile.name'];
        return newErrors;
      });
    }
  }, [formData.role]);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {typeof error === 'string' ? error : error.message || 'Registration failed'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="profile.firstName"
                label="First Name"
                value={formData.profile.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!validationErrors['profile.firstName']}
                helperText={validationErrors['profile.firstName']}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="profile.lastName"
                label="Last Name"
                value={formData.profile.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!validationErrors['profile.lastName']}
                helperText={validationErrors['profile.lastName']}
              />
            </Box>

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Account Type</FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel value="user" control={<Radio />} label="Art Collector" />
                <FormControlLabel value="artist" control={<Radio />} label="Artist" />
              </RadioGroup>
            </FormControl>

            {formData.role === 'artist' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="artistProfile.name"
                  label="Artist Name"
                  value={formData.artistProfile.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!validationErrors['artistProfile.name']}
                  helperText={validationErrors['artistProfile.name']}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  rows={3}
                  name="artistProfile.bio"
                  label="Artist Bio"
                  value={formData.artistProfile.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                isLoading || 
                (Object.keys(validationErrors).some(key => touched[key] && validationErrors[key])) ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                !formData.profile.firstName ||
                !formData.profile.lastName ||
                (formData.role === 'artist' && !formData.artistProfile.name)
              }
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            
            <Box textAlign="center">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
