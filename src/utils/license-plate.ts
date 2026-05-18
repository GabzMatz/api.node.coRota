/** Placa antiga (ABC1234) e Mercosul (ABC1D23). */
const BRAZIL_PLATE_REGEX = /^[A-Z]{3}[-\s]?([0-9]{4}|[0-9][A-Z][0-9]{2})$/i;

export const normalizeLicensePlate = (plate: string): string =>
  plate.replace(/[\s-]/g, "").toUpperCase();

export const isValidBrazilianLicensePlate = (plate: string): boolean => {
  const normalized = normalizeLicensePlate(plate);
  if (normalized.length !== 7) {
    return false;
  }
  return BRAZIL_PLATE_REGEX.test(normalized);
};

export const formatLicensePlate = (plate: string): string => {
  const normalized = normalizeLicensePlate(plate);
  if (!isValidBrazilianLicensePlate(normalized)) {
    return plate.trim().toUpperCase();
  }
  const letters = normalized.slice(0, 3);
  const suffix = normalized.slice(3);
  return `${letters}-${suffix}`;
};
