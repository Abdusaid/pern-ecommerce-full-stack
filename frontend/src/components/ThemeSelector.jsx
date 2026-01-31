import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useUser } from "@clerk/clerk-react";
import { useState, forwardRef, useImperativeHandle } from "react";

const ThemeSelector = forwardRef((props, ref) => {
  const { theme, setTheme } = useThemeStore();
  const { isSignedIn } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);

  // Expose collapse method to parent component
  useImperativeHandle(ref, () => ({
    collapseThemeSelector: () => {
      setIsExpanded(false);
    }
  }));

  // Don't render if user is not authenticated
  if (!isSignedIn) {
    return null;
  }

  // Find current theme details
  const currentTheme = THEMES.find(t => t.name === theme) || THEMES[0];

  return (
    <div className="space-y-2">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {currentTheme.colors.map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{currentTheme.label}</span>
        </div>
        <ChevronDownIcon className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expandable Theme Grid */}
      {isExpanded && (
        <div className="space-y-2 pt-2">
          <p className="text-xs text-base-content/60">Choose your preferred theme</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.name}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200
                  ${
                    theme === themeOption.name
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-base-300 hover:border-primary/50 hover:bg-base-300"
                  }
                `}
                onClick={() => {
                  setTheme(themeOption.name, isSignedIn);
                  setIsExpanded(false);
                }}
              >
                {/* Selected indicator */}
                {theme === themeOption.name && (
                  <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                    <CheckIcon className="size-3 text-primary-content" />
                  </div>
                )}

                {/* Theme label */}
                <div className="text-xs font-medium mb-2 text-left">{themeOption.label}</div>

                {/* Theme preview colors */}
                <div className="flex gap-1">
                  {themeOption.colors.map((color, i) => (
                    <span
                      key={i}
                      className="flex-1 h-6 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ThemeSelector.displayName = 'ThemeSelector';

export default ThemeSelector;