import React from 'react';
import './Avatar.css';

const Avatar = props => {
  const handleImageError = (e) => {
    console.error('Avatar image failed to load:', props.image);
    // Use a data URL for a default avatar instead of relying on a file
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS42NDQgMzEuNjQ0IDU0IDQ2IDU0SDU0QzY4LjM1NiA1NCA4MCA2NS42NDQgODAgODBWMTAwSDIwVjgwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4=';
  };

  const handleImageLoad = () => {
    console.log('Avatar image loaded successfully:', props.image);
  };

  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS42NDQgMzEuNjQ0IDU0IDQ2IDU0SDU0QzY4LjM1NiA1NCA4MCA2NS42NDQgODAgODBWMTAwSDIwVjgwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4='}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default Avatar;
