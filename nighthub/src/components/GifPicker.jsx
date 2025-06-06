import React, { useState, useEffect } from 'react';
import '../styles/main.css';

const GifPicker = ({ giphy, onSelect }) => {
  const [gifs, setGifs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGifs = async () => {
      const { data } = await giphy.search(search || 'funny', { limit: 10 });
      setGifs(data);
    };
    fetchGifs();
  }, [search, giphy]);

  return (
    <div className="gif-picker">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search GIFs..."
        className="input"
      />
      <div className="gif-grid">
        {gifs.map((gif) => (
          <img
            key={gif.id}
            src={gif.images.fixed_height.url}
            alt={gif.title}
            onClick={() => onSelect({ url: gif.images.fixed_height.url })}
            className="gif"
          />
        ))}
      </div>
    </div>
  );
};

export default GifPicker;