import { createTheme } from '@mui/material/styles';

const theme = createTheme({
 palette: {
  mode: 'dark',
  primary: {
    main: '#5C2D3A',      // rubis sombre
    light: '#7A3D4D',
    dark: '#3E1E28',
    contrastText: '#EEE5D3',
  },
  secondary: {
    main: '#C4A86B',      // champagne cuivré
    light: '#D9C07E',
    dark: '#9A7E46',
    contrastText: '#080B0F',
  },
  background: {
    default: '#080B0F',   // nuit profonde
    paper:   '#111820',   // ardoise marine
  },
  text: {
    primary:   '#EEE5D3', // ivoire doux
    secondary: '#8A9BAD', // brume argentée
    disabled:  '#3D4A58',
  },
  divider: 'rgba(196,168,107,0.10)',
  error:   { main: '#B33A3A', light: '#E57373' },
  success: { main: '#2E6B52', light: '#66BB6A' },
  warning: { main: '#A07828' },
},
  typography: {
    fontFamily: '"Lato", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif' },
    h2: { fontFamily: '"Playfair Display", serif' },
    h3: { fontFamily: '"Playfair Display", serif' },
    h4: { fontFamily: '"Playfair Display", serif' },
    h5: { fontFamily: '"Playfair Display", serif' },
    h6: { fontFamily: '"Playfair Display", serif' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        elevation3: {
          boxShadow: '0 4px 20px rgba(201, 168, 76, 0.15)',
        },
        elevation4: {
          boxShadow: '0 6px 30px rgba(201, 168, 76, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});

export default theme;
