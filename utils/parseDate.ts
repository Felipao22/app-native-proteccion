interface FormatOptions {
  date: string;
  local: string;
}

export const formatDate = (
  date: FormatOptions["date"],
  local: FormatOptions["local"]
) => {
  const parsedDate = new Date(date);
  const formatted = new Intl.DateTimeFormat(local, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(parsedDate);

  return `${formatted} hs.`;
};
