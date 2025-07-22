import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSelector = ({ variant = 'outlined', size = 'small' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const theme = useTheme();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setCurrentLanguage(newLanguage);
    
    // Update document direction for RTL languages
    if (newLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = newLanguage;
    }
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <FormControl variant={variant} size={size}>
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        displayEmpty
        renderValue={(selected) => {
          const lang = languages.find(l => l.code === selected);
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <LanguageIcon fontSize="small" />
              <span>{lang?.flag}</span>
              <Typography variant="body2" component="span">
                {lang?.name}
              </Typography>
            </Box>
          );
        }}
        sx={{
          minWidth: 120,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem 
            key={language.code} 
            value={language.code}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minWidth: 150
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <span style={{ fontSize: '1.2em' }}>{language.flag}</span>
              <Typography variant="body2">
                {language.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
