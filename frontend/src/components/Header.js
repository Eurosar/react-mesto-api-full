import React from 'react';
import logo from '../images/logo.svg';

/**
 * Компонент шапки
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
function Header({children}) {
  return (
    <header className="header">
      <img className="logo" src={logo} alt="Логотип"/>
      {children}
    </header>
  );
}

export default Header;
