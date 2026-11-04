export const LogoMark = ({ size = 40 }) => (
  <div 
    className="rounded-full bg-red-500 flex items-center justify-center font-bold tracking-wider border border-red-500 shadow-lg shadow-red-600/20 text-white"
    style={{ 
      width: `${size}px`, 
      height: `${size}px`,
      fontSize: `${size * 0.45}px` // Ajustează automat mărimea textului în funcție de logo
    }}
    data-testid="logo-mark"
  >
    GT
  </div>
);

