export function validateInspectionData(data) {
  const errors = [];

  if (!data.houseId) errors.push("House ID is required");
  if (!data.inspectorId) errors.push("Inspector ID is required");
  if (!data.categories || data.categories.length === 0)
    errors.push("At least one category must be inspected");

  return {
    isValid: errors.length === 0,
    errors,
  };
}