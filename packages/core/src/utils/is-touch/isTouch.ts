// Check if device has touch
export const getIsTouch = () => !matchMedia('(pointer:fine)').matches;
