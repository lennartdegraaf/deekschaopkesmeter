import React, { useState, useEffect } from 'react';

const SheepCrowdfunding = () => {
  // Werk met centen (integers) in plaats van euros (floating points)
  const [currentAmount, setCurrentAmount] = useState(0); // in centen
  const [displayAmount, setDisplayAmount] = useState(0); // in centen
  const [isAnimating, setIsAnimating] = useState(false);
  
  const totalGoal = 200000; // €2000 = 200000 centen
  const sheepCost = 40000; // €400 = 40000 centen
  const totalSheep = 5;
  
  // Google Sheets configuratie
  const SHEET_ID = '1Ex43lC_rnq7a7Lir8FDHz_DMqjWMXwor4LZ56ytokG0';
  const SHEET_NAME = 'donaties'; // Naam van het tabblad in de Google Sheet
  const COLUMN = 'B'; // Kolom waar de bedragen in staan (Donatie kolom)
  
  // Haal bedragen op uit Google Sheets
  const fetchAmount = async () => {
    try {
      // Google Sheets URL voor publieke sheets (geen API key nodig!)
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&range=${COLUMN}:${COLUMN}`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      // Google geeft de response terug als: google.visualization.Query.setResponse({...})
      // We moeten de JSON eruit halen
      const jsonString = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1];
      const data = JSON.parse(jsonString);
      
      // Tel alle bedragen op uit de kolom (skip automatisch tekst, tel alleen getallen)
      let total = 0;
      const rows = data.table.rows;
      
      for (let i = 0; i < rows.length; i++) { // Start bij 0, filter op getallen
        const cell = rows[i].c[0]; // Eerste (en enige) kolom
        if (cell && cell.v) {
          const amount = parseFloat(cell.v);
          if (!isNaN(amount) && amount > 0) { // Tel alleen echte positieve getallen
            total += amount;
          }
        }
      }
      
      // Converteer naar centen (vermenigvuldig met 100)
      const totalInCents = Math.round(total * 100);
      setCurrentAmount(totalInCents);
      
      console.log(`✅ Bedrag opgehaald: €${total.toFixed(2)} (${rows.length - 1} donaties)`);
    } catch (error) {
      console.error('❌ Fout bij ophalen bedragen:', error);
      // Bij fout: gebruik test knop om handmatig te testen
    }
  };
  
  useEffect(() => {
    // Start op 0, gebruiker klikt op knop om te laden
    setCurrentAmount(0);
  }, []);
  
  // Animeer het bedrag omhoog (of naar beneden bij reset)
  useEffect(() => {
    setIsAnimating(true);
    const duration = 2500; // 2.5 seconden animatie
    const startAmount = displayAmount;
    const difference = currentAmount - startAmount;
    const startTime = performance.now();
    let animationId = null;
    let cancelled = false;
    
    const animate = (currentTime) => {
      if (cancelled) return; // Stop als de animatie gecanceld is
      
      const elapsed = currentTime - startTime;
      const linearProgress = Math.min(elapsed / duration, 1); // 0 tot 1, lineair
      
      // Subtiele ease-out: vertraagt lichtjes aan het einde
      const easedProgress = 1 - Math.pow(1 - linearProgress, 2);
      
      if (linearProgress < 1) {
        const newAmount = Math.round(startAmount + (difference * easedProgress));
        setDisplayAmount(newAmount);
        animationId = requestAnimationFrame(animate);
      } else {
        // Animatie klaar
        setIsAnimating(false);
        setDisplayAmount(currentAmount);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      // Stop de animatie als het component unmount of de dependencies veranderen
      cancelled = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [currentAmount]);
  
  const percentage = Math.min((displayAmount / totalGoal) * 100, 100);
  const sheepUnlocked = Math.min(Math.floor(displayAmount / sheepCost), totalSheep);
  
  // Converteer centen naar euros voor display
  const displayEuros = displayAmount / 100;
  const goalEuros = totalGoal / 100;
  
  // Schaap component met echte plaatjes
  const Sheep = ({ unlocked, imageNumber }) => (
    <div 
      className={`transition-all duration-100 ${unlocked ? 'opacity-100' : 'opacity-30'}`}
      style={{ 
        filter: unlocked ? 'grayscale(0%)' : 'grayscale(100%)'
      }}
    >
      <img 
        src={`/images/sheep${imageNumber}.png`}
        alt={`Schaap ${imageNumber}`}
        className="drop-shadow-lg object-contain w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
      />
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 rounded-lg shadow-lg relative" style={{ backgroundColor: '#94c13d' }}>
      {/* Logo mobiel - bovenaan gecentreerd, alleen zichtbaar op kleine schermen */}
      <div className="block md:hidden w-32 h-16 mx-auto mb-4">
        <img 
          src="/images/logo-GoBK.svg" 
          alt="GoBK Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Logo desktop - rechtsboven, alleen zichtbaar op grotere schermen */}
      <div className="hidden md:block absolute top-4 right-4 w-48 h-24">
        <img 
          src="/images/logo-GoBK.svg" 
          alt="GoBK Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 md:pr-52 lg:pr-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: '#1d284a' }}>
          Crowdfunding Dèèkschaopkes
        </h2>
      </div>
      
      {/* Bedrag weergave */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1d284a' }}>
          €{Math.round(displayEuros).toLocaleString('nl-NL')}
        </div>
        <div className="text-base sm:text-lg md:text-xl" style={{ color: '#1d284a' }}>
          van €{goalEuros.toLocaleString('nl-NL')}
        </div>
      </div>
      
      {/* Schaapjes display boven de meter */}
      <div className="relative mb-2">
        <div className="relative items-end h-12 sm:h-16 md:h-24">
          {[...Array(totalSheep)].map((_, index) => {
            // Positioneer elk schaapje bij 10%, 30%, 50%, 70%, 90%
            const position = 10 + (index * 20);
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
                  unlocked={index + 1 <= sheepUnlocked}
                  imageNumber={index + 1}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Voortgangsbalk */}
      <div className="mb-6 sm:mb-8">
        <div className="relative h-10 sm:h-12 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: '#ffffff' }}>
          {/* Vullende balk */}
          <div 
            className="absolute h-full rounded-full"
            style={{ 
              width: `${percentage}%`,
              background: 'linear-gradient(to right, #f8b133, #f8b133)'
            }}
          >
            {/* Glans effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
          </div>
          
          {/* Percentage tekst */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base sm:text-lg font-bold drop-shadow-sm" style={{ color: '#1d284a' }}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Ververs knop */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <button 
          onClick={fetchAmount}
          className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors font-semibold text-sm sm:text-base"
          style={{ 
            backgroundColor: '#f8b133',
            color: '#1d284a'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e09a1f'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f8b133'}
        >
          Toon me de huidige stand
        </button>
      </div>
    </div>
  );
};

export default SheepCrowdfunding;

