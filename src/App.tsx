import React, { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function App() {
  const [selected, setSelected] = useState<string>("");
  const noButtonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Set initial position after component mount
    setPosition({
      x: window.innerWidth / 2 - 50,
      y: window.innerHeight / 2 + 50
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const moveNoButton = (e: MouseEvent) => {
    if (noButtonRef.current && !isMobile) {
      const rect = noButtonRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const buttonX = rect.left + rect.width / 2;
      const buttonY = rect.top + rect.height / 2;
      
      // Calculate distance between mouse and button
      const distance = Math.sqrt(
        Math.pow(mouseX - buttonX, 2) + Math.pow(mouseY - buttonY, 2)
      );
      
      // If mouse is close to the button, move it away
      if (distance < 100) {
        // Calculate direction vector from mouse to button
        const dirX = buttonX - mouseX;
        const dirY = buttonY - mouseY;
        
        // Normalize the direction vector
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        const normalizedDirX = dirX / length;
        const normalizedDirY = dirY / length;
        
        // Calculate new position (move in the opposite direction of the mouse)
        let newX = buttonX + normalizedDirX * 100;
        let newY = buttonY + normalizedDirY * 100;
        
        // Keep the button within viewport bounds with padding
        const padding = 50;
        newX = Math.max(padding, Math.min(window.innerWidth - padding, newX));
        newY = Math.max(padding, Math.min(window.innerHeight - padding, newY));
        
        setPosition({ 
          x: newX - rect.width / 2, 
          y: newY - rect.height / 2 
        });
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', moveNoButton);
    return () => document.removeEventListener('mousemove', moveNoButton);
  }, [isMobile]);

  const handleSiClick = () => {
    setSelected("si");
    if (typeof window !== 'undefined') {
      window.confetti?.({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-400" />
        
        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-6 animate-pulse" />
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          ¿Quieres ser mi novia?
        </h1>

        <div className="space-y-4">
          <label className="flex items-center justify-center space-x-3 p-4 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer">
            <input
              type="radio"
              name="response"
              value="si"
              checked={selected === "si"}
              onChange={handleSiClick}
              className="w-5 h-5 text-pink-500 focus:ring-pink-400"
            />
            <span className="text-xl font-medium text-gray-700">Sí 💖</span>
          </label>

          {!isMobile && (
            <div
              ref={noButtonRef}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.2s ease-out',
                zIndex: 50,
                visibility: position.x === 0 && position.y === 0 ? 'hidden' : 'visible',
                pointerEvents: 'none'
              }}
              className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-white shadow-md"
            >
              <input
                type="radio"
                name="response"
                value="no"
                checked={selected === "no"}
                onChange={() => setSelected("no")}
                className="w-5 h-5 text-gray-400 cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              />
              <span className="text-xl font-medium text-gray-700">No 💔</span>
            </div>
          )}
        </div>

        {selected === "si" && (
          <div className="mt-8 p-4 bg-pink-50 rounded-lg">
            <p className="text-xl text-pink-600 font-medium">
              ¡Te amo! 💝
            </p>
          </div>
        )}
      </div>
    </div>
  );
}