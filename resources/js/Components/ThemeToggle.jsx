import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hasDarkClass = document.documentElement.classList.contains("dark");
        setIsDark(hasDarkClass);
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);

        if (nextDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    if (!mounted) {
        return (
            <div className={`w-9 h-9 rounded-lg ${className}`} />
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`relative p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${className}`}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Mode Terang" : "Mode Gelap"}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
                <Moon className="w-5 h-5 text-zinc-600 hover:-rotate-12 transition-transform duration-300" />
            )}
        </button>
    );
}
