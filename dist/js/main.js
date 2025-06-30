let prevWidth = window.innerWidth;

const appHeight = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};

appHeight();

window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth;
  if (currentWidth !== prevWidth) {
    prevWidth = currentWidth;
    appHeight();
  }
});