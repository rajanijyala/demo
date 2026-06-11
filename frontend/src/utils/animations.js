export const fadeInUp = (y = 14) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
});
