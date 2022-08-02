import useStore from "../lib/store";
import { ThemeOptions } from "../lib/types";

function useTheme() {
  const theme = useStore((state) => state.theme);
  const update = useStore((state) => state.updateTheme);

  // Toggles class on rootelement when theme is changed
  const updateTheme = (value: ThemeOptions) => {
    switch (value) {
      case ThemeOptions.LIGHT:
        document.documentElement.classList.remove("theme-dark");
        break;
      case ThemeOptions.DARK:
        document.documentElement.classList.add("theme-dark");
        break;
      default:
        break;
    }
    update(value);
  };

  return { theme, updateTheme };
}

export default useTheme;
