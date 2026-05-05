import logoImage from 'figma:asset/04f2d8e6737d0429574243a378114bca691c7604.png';

export function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const dimensions = {
    sm: { width: 40, height: 48 },
    md: { width: 50, height: 60 },
    lg: { width: 80, height: 96 }
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoImage} 
        alt="PT PLN Batam Logo" 
        width={width} 
        height={height}
        className="object-contain"
      />
    </div>
  );
}

export function LogoIcon({ size = 50 }: { size?: number }) {
  return (
    <img 
      src={logoImage} 
      alt="PT PLN Batam" 
      width={size} 
      height={size * 1.2}
      className="object-contain"
    />
  );
}
