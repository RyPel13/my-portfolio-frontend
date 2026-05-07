import React, { useState } from 'react';

const links = [
  { label: 'About', href: '#person' },
  { label: 'Projects', href: '#projects' },
  { label: 'Interests', href: '#interests' },
  { label: 'Goals', href: '#goals' },
];

function Navbar() {
  const [hovered, setHovered] = useState(null);

  const handleScroll = (e, href) => {
    e.preventDefault();
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        {links.map(link => (
          <li key={link.label} style={{ listStyle: 'none' }}>
            <a
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              onMouseEnter={() => setHovered(link.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...styles.link,
                color: hovered === link.label ? '#22d3ee' : '#94a3b8',
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #1e293b',
    padding: '1rem 2rem',
  },
  ul: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
};

export default Navbar;