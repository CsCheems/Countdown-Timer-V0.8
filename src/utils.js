export const hexToRgb = (hex) => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

export function obtenerBooleanos(paramName, defaultValue) {
    const param = urlParameters.get(paramName);
    if (param === null) {
        return defaultValue;
    }
    return param.toLowerCase() === 'true';
}

export function GetIntParam(paramName, defaultValue) {
    const param = urlParameters.get(paramName);
    if (param === null) {
        return defaultValue;
    }
    const parsed = parseInt(param, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

export function getPausedTime() {
    const pausedTime = localStorage.getItem('pause');
    return pausedTime ? parseInt(pausedTime, 10) : 0;
}
