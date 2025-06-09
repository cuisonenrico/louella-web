export function formatCurrency(value: any) {
  if (typeof value === "number") {
    return value.toLocaleString("en-US", { style: "currency", currency: "PHP" });
  }
  if (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "") {
    return Number(value).toLocaleString("en-US", { style: "currency", currency: "PHP" });
  }
  return value;
}