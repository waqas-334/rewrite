import { getProductShortName } from "../productLoggerHelper";

describe("getProductShortName", () => {
  it("should convert dot-separated strings to first letters, skipping the first part", () => {
    expect(getProductShortName("grammar.monthly.premium")).toBe("mp");
    expect(getProductShortName("grammar.weekly.premium")).toBe("wp");
    expect(getProductShortName("grammar.annual.premium")).toBe("ap");
  });

  it("should handle underscore-separated strings", () => {
    expect(getProductShortName("grammar_annual_premium")).toBe("ap");
    expect(getProductShortName("grammar_monthly_premium")).toBe("mp");
  });

  it("should handle mixed dot and underscore separators", () => {
    expect(getProductShortName("grammar.annual.premium.with_trial")).toBe(
      "apwt"
    );
    expect(getProductShortName("grammar.annual.premium.with_offer")).toBe(
      "apwo"
    );
  });

  it("should handle single word inputs", () => {
    expect(getProductShortName("grammar")).toBe("");
    expect(getProductShortName("premium")).toBe("p");
  });

  it("should handle empty string", () => {
    expect(getProductShortName("")).toBe("");
  });

  it("should handle strings with multiple consecutive dots or underscores", () => {
    expect(getProductShortName("grammar..monthly..premium")).toBe("mp");
    expect(getProductShortName("grammar__monthly__premium")).toBe("mp");
  });
});
