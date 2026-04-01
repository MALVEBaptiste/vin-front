import { Box } from '@mui/material';
import './WineLoader.css';

interface WineLoaderProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const WineLoader: React.FC<WineLoaderProps> = ({ 
  size = 'medium', 
  showText = true 
}) => {
  const sizeMap = {
    small: { container: 80, bottle: 40, glass: 35 },
    medium: { container: 120, bottle: 60, glass: 50 },
    large: { container: 160, bottle: 80, glass: 65 },
  };

  const dimensions = sizeMap[size];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <div className="wine-loader" style={{ width: dimensions.container, height: dimensions.container }}>
        {/* Verre */}
        <svg
          viewBox="0 0 100 150"
          className="glass"
          style={{ width: dimensions.glass, height: dimensions.glass * 1.5 }}
        >
          {/* Remplissage du verre (animation) */}
          <g className="wine-fill">
            <path
              d="M 30 100 Q 30 130 35 135 L 65 135 Q 70 130 70 100 Z"
              fill="url(#wineGradient)"
            />
          </g>

          {/* Verre vide */}
          <path
            d="M 25 30 L 30 100 Q 30 130 35 135 L 65 135 Q 70 130 70 100 L 75 30 Z"
            fill="none"
            stroke="#8B4513"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pied du verre */}
          <path
            d="M 35 135 L 40 155 L 60 155 L 65 135"
            fill="#8B4513"
            stroke="#8B4513"
            strokeWidth="2"
          />
          {/* Base du pied du verre */}
          <ellipse cx="50" cy="155" rx="12" ry="4" fill="#8B4513" />

          {/* Léger relief sur le verre */}
          <ellipse cx="50" cy="30" rx="25" ry="3" fill="none" stroke="#A0522D" strokeWidth="0.5" opacity="0.5" />

          {/* Dégradé pour le vin */}
          <defs>
            <linearGradient id="wineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#722f37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4a1f23" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Bouteille */}
        <svg
          viewBox="0 0 100 180"
          className="bottle"
          style={{ width: dimensions.bottle, height: dimensions.bottle * 1.8 }}
        >
          {/* Reste du vin dans la bouteille (animation) */}
          <g className="wine-remaining">
            <path
              d="M 35 60 L 35 150 Q 35 155 40 155 L 60 155 Q 65 155 65 150 L 65 60 Z"
              fill="url(#bottleWineGradient)"
            />
          </g>

          {/* Corps de la bouteille */}
          <path
            d="M 35 60 L 35 150 Q 35 155 40 155 L 60 155 Q 65 155 65 150 L 65 60"
            fill="none"
            stroke="#2d5016"
            strokeWidth="2"
            opacity="0.7"
          />

          {/* Goulot */}
          <rect x="42" y="25" width="16" height="35" fill="none" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />

          {/* Capsule */}
          <ellipse cx="50" cy="25" rx="8" ry="3" fill="#c41e3a" opacity="0.8" />

          {/* Bouchon */}
          <rect x="47" y="15" width="6" height="10" fill="#8B7355" />

          {/* Étiquette */}
          <rect x="30" y="85" width="40" height="35" fill="#f5e6d3" opacity="0.7" />
          <text x="50" y="105" textAnchor="middle" fontSize="8" fill="#722f37" fontWeight="bold">
            VIN
          </text>

          {/* Brillance sur la bouteille */}
          <ellipse cx="70" cy="90" rx="3" ry="15" fill="#7cb342" opacity="0.3" />

          {/* Dégradé pour le vin dans la bouteille */}
          <defs>
            <linearGradient id="bottleWineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#722f37" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3a1519" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Flux de vin (animation) */}
        <svg className="wine-stream" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 50 10 Q 45 30 42 50 Q 40 60 40 70"
            fill="none"
            stroke="#722f37"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {showText && (
        <p className="wine-loader-text">Chargement...</p>
      )}
    </Box>
  );
};
