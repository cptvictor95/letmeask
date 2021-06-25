import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../Button";
import logoDark from "../../assets/images/logo-darkmode.svg";
import logoLight from "../../assets/images/logo-lightmode.svg";
import { FiSun, FiMoon } from "react-icons/fi";

export const Header: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header>
      <div className="content">
        {theme === "light" ? (
          <img src={logoLight} alt="" />
        ) : (
          <img src={logoDark} alt="" />
        )}
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
