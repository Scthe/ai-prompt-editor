declare global {
  const setAppTheme: (nextTheme: 'light' | 'dark') => void;
}

export const toggleTheme = () => {
  const isDarkNow = document.documentElement.classList.contains('dark-theme');
  const nextTheme = isDarkNow ? 'light' : 'dark';
  setAppTheme(nextTheme); // see script in 'index.html'
};
