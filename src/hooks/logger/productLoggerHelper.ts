/**
 *
 * grammar.monthly.premium -> mp
 *
 * grammar.weekly.premium -> wp
 *
 * grammar.annual.premium -> ap
 *
 * grammar.annual.premium.with_trial -> apwt
 *
 * grammar.annual.premium.with_offer -> apwo
 *
 */

export const getProductShortName = (productId: string): string => {
  // Convert underscores to dots if they exist
  const normalizedId = productId.replace(/_/g, ".");

  // Split by dots and take first character of each part
  const parts = normalizedId.split(".");

  // If there's only one part, return empty string for 'grammar', otherwise first character
  if (parts.length === 1) {
    return parts[0] === "grammar" ? "" : parts[0].charAt(0);
  }

  // Skip the first part (grammar) and map remaining parts to their first character
  return parts
    .slice(1)
    .map((part) => part.charAt(0))
    .join("");
};
