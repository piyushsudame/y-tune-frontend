'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);

  const loginToSpotify = async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to initiate Spotify login:', error);
    }
  };

  const handleSpotifyCallback = async (code) => {
    try {
      const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
      const data = await response.json();
      
      if (data.access_token) {
        setSpotifyToken(data.access_token);
        setIsSpotifyAuthenticated(true);
        // Store token in cookie instead of localStorage
        document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
      }
    } catch (error) {
      console.error('Failed to complete Spotify authentication:', error);
    }
  };

  useEffect(() => {
    // Check for stored token in cookie on mount
    const spotifyToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('spotify_token='))
      ?.split('=')[1];

    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      setIsSpotifyAuthenticated(true);
    }
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyToken,
        isSpotifyAuthenticated,
        loginToSpotify,
        handleSpotifyCallback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

const handleSpotifyCallback = async (code) => {
  try {
    const response = await fetch(`/api/auth/callback/spotify?code=${code}`);
    const data = await response.json();
    
    if (data.access_token) {
      setSpotifyToken(data.access_token);
      setIsSpotifyAuthenticated(true);
      // Store token in cookie instead of localStorage
      document.cookie = `spotify_token=${data.access_token}; path=/; max-age=3600`;
    }
  } catch (error) {
    console.error('Failed to complete Spotify authentication:', error);
  }
};

useEffect(() => {
  // Check for stored token in cookie on mount
  const spotifyToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('spotify_token='))
    ?.split('=')[1];

  if (spotifyToken) {
    setSpotifyToken(spotifyToken);
    setIsSpotifyAuthenticated(true);
  }
}, []);