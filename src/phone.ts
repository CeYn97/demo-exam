export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const rest = digits.replace(/^[78]/, "").slice(0, 10);
  const groups = [
    rest.slice(0, 3),
    rest.slice(3, 6),
    rest.slice(6, 8),
    rest.slice(8, 10),
  ];

  let phone = "8";
  if (groups[0]) phone += `(${groups[0]}`;
  if (groups[1]) phone += `)${groups[1]}`;
  if (groups[2]) phone += `-${groups[2]}`;
  if (groups[3]) phone += `-${groups[3]}`;
  return phone;
}
