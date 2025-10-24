interface FormatOptions {
  date: string;
  local: string;
}

export const formatDateWithHours = (
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

export const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day, 12);
};

export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
