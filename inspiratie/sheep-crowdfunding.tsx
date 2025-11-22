import React, { useState, useEffect } from 'react';

const SheepCrowdfunding = () => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const totalGoal = 2000;
  const sheepCost = 400;
  const totalSheep = 5;
  
  // Simuleer het ophalen van data - vervang dit later met Google Sheets
  const fetchAmount = () => {
    // Tijdelijk: simuleer een bedrag voor demo
    // Later vervangen we dit met de Google Sheets API call
    const simulatedAmount = 1234; // Test bedrag
    setCurrentAmount(simulatedAmount);
  };
  
  useEffect(() => {
    fetchAmount();
  }, []);
  
  // Animeer het bedrag omhoog
  useEffect(() => {
    if (currentAmount > displayAmount) {
      setIsAnimating(true);
      const duration = 2000; // 2 seconden animatie
      const steps = 60;
      const increment = (currentAmount - displayAmount) / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        setDisplayAmount(prev => {
          const next = prev + increment;
          if (step >= steps) {
            clearInterval(timer);
            setIsAnimating(false);
            return currentAmount;
          }
          return next;
        });
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [currentAmount]);
  
  const percentage = Math.min((displayAmount / totalGoal) * 100, 100);
  const sheepUnlocked = Math.floor(displayAmount / sheepCost);
  
  // SVG Schaap component (geïnspireerd op de foto)
  const Sheep = ({ unlocked, delay }) => (
    <div 
      className={`transition-all duration-500 ${unlocked ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
      style={{ 
        transitionDelay: unlocked ? `${delay}ms` : '0ms',
        transform: unlocked ? 'scale(1)' : 'scale(0)'
      }}
    >
      <svg width="60" height="45" viewBox="0 0 60 45" className="drop-shadow-lg">
        {/* Schaap lichaam (rond/ovaal, lichtgrijs) */}
        <ellipse cx="30" cy="25" rx="25" ry="18" fill="#d4d4d4" />
        
        {/* Zwarte oren */}
        <ellipse cx="20" cy="12" rx="6" ry="10" fill="#1a1a1a" transform="rotate(-20 20 12)" />
        <ellipse cx="40" cy="12" rx="6" ry="10" fill="#1a1a1a" transform="rotate(20 40 12)" />
        
        {/* Kop (iets donkerder) */}
        <ellipse cx="30" cy="18" rx="10" ry="12" fill="#b8b8b8" />
        
        {/* Poten (zwart) */}
        <rect x="18" y="38" width="5" height="6" rx="2" fill="#1a1a1a" />
        <rect x="28" y="38" width="5" height="6" rx="2" fill="#1a1a1a" />
        <rect x="37" y="38" width="5" height="6" rx="2" fill="#1a1a1a" />
      </svg>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-b from-green-50 to-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Crowdfunding Schapenkunstwerk
        </h2>
        <p className="text-gray-600">Help ons de 5 schaapjes te realiseren!</p>
      </div>
      
      {/* Bedrag weergave */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-green-700 mb-2">
          €{Math.round(displayAmount).toLocaleString('nl-NL')}
        </div>
        <div className="text-xl text-gray-600">
          van €{totalGoal.toLocaleString('nl-NL')}
        </div>
        <div className="text-lg text-gray-500 mt-2">
          {sheepUnlocked} van {totalSheep} schaapjes gefinancierd 🐑
        </div>
      </div>
      
      {/* Schaapjes display boven de meter */}
      <div className="relative mb-2">
        <div className="relative items-end" style={{ height: '60px' }}>
          {[...Array(totalSheep)].map((_, index) => {
            // Positioneer elk schaapje bij 20%, 40%, 60%, 80%, 100%
            const position = (index + 1) * 20;
            return (
              <div 
                key={index} 
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                  bottom: 0
                }}
              >
                <Sheep 
                  unlocked={index < sheepUnlocked}
                  delay={index * 300}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Voortgangsbalk met streepjes */}
      <div className="mb-2 relative">
        <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Vullende balk */}
          <div 
            className="absolute h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          >
            {/* Glans effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
          </div>
          
          {/* Percentage tekst */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-700 drop-shadow-sm">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        
        {/* Streepjes op de meter (zonder eerste en laatste) */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          {[...Array(totalSheep)].map((_, index) => {
            const position = (index + 1) * 20;
            return (
              <div 
                key={index} 
                className="absolute w-0.5 h-12 bg-gray-400"
                style={{ 
                  left: `${position}%`,
                  opacity: 0.6 
                }}
              ></div>
            );
          })}
        </div>
      </div>
      
      {/* Markeringen onder de balk */}
      <div className="relative">
        {[...Array(totalSheep)].map((_, index) => {
          const position = (index + 1) * 20;
          return (
            <div 
              key={index}
              className="absolute text-center"
              style={{ 
                left: `${position}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="text-xs text-gray-500">€{(index + 1) * sheepCost}</div>
            </div>
          );
        })}
      </div>
      <div className="h-6"></div>
      
      {/* Info tekst */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>De meter wordt automatisch bijgewerkt wanneer er nieuwe donaties binnenkomen.</p>
      </div>
      
      {/* Test knoppen (later verwijderen) */}
      <div className="mt-8 flex gap-2 justify-center">
        <button 
          onClick={() => setCurrentAmount(400)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test: €400
        </button>
        <button 
          onClick={() => setCurrentAmount(1234)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test: €1.234
        </button>
        <button 
          onClick={() => setCurrentAmount(2000)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test: €2.000 (vol!)
        </button>
      </div>
    </div>
  );
};

export default SheepCrowdfunding;