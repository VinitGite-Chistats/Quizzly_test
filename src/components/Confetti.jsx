import React, { useEffect, useState } from 'react'
import ConfettiExplosion from "react-confetti-explosion";

const Confetti = () => {
    const [isExploding, setIsExploading] = useState(false);

    useEffect(() => {
      setIsExploading(true);
    }, []);
    return (
      <div>
        {isExploding && (
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={250}
            width={2000}
          />
        )}
      </div>
    );
}

export default Confetti