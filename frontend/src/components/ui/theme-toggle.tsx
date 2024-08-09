import { useTheme } from "@/hooks/useTheme";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button title="Toggle Theme" onClick={toggleTheme}>
      {theme === "light" ? (
        <FaMoon className="h-6 w-6" />
      ) : (
        <FaSun className="h-6 w-6" />
      )}
    </button>
  );
};
export default ThemeToggle;
