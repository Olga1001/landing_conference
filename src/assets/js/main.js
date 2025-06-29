const appHeight = () => {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};
appHeight();
window.addEventListener('resize', appHeight);