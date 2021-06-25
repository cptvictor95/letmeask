import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../Button";
import logoImg from "../../assets/images/logo.svg";
import { FiSun, FiMoon } from "react-icons/fi";

export const Header: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header>
      <div className="content">
        <img src={logoImg} alt="" />
        <div>
          {children}
          <Button className="button icon" onClick={toggleTheme}>
            {theme === "light" ? <FiSun /> : <FiMoon />}
          </Button>
        </div>
      </div>
    </header>
  );
};
