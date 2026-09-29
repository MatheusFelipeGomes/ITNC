const TZ = "America/Sao_Paulo";

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const MESES_CURTOS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

interface Parts {
  day: string;
  month: number;
  year: string;
  hour: string;
  minute: string;
}

/** Deterministic date parts in America/Sao_Paulo (same on server and client). */
function toParts(value?: string | null): Parts | null {
  if (!value) return null;
  const iso = value.length <= 10 ? `${value}T12:00:00Z` : value;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const map: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  return {
    day: map['day'] ?? "01",
    month: Number(map['month'] ?? "1"),
    year: map['year'] ?? "1970",
    hour: (map['hour'] ?? "00") === "24" ? "00" : (map['hour'] ?? "00"),
    minute: map['minute'] ?? "00",
  };
}

export function formatDate(value?: string | null): string {
  const p = toParts(value);
  return p ? `${p.day} de ${MESES[p.month - 1]} de ${p.year}` : "";
}

export function formatShortDate(value?: string | null): string {
  const p = toParts(value);
  return p ? `${p.day}/${String(p.month).padStart(2, "0")}/${p.year}` : "";
}

export function formatDateTime(value?: string | null): string {
  const p = toParts(value);
  return p ? `${formatShortDate(value)} às ${p.hour}h${p.minute}` : "";
}

export function formatDayMonth(value?: string | null): { dia: string; mes: string } {
  const p = toParts(value);
  if (!p) return { dia: "--", mes: "" };
  return { dia: p.day, mes: MESES_CURTOS[p.month - 1] ?? "" };
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export const SITUACAO_EDITAL: Record<string, string> = {
  aberto: "Inscrições abertas",
  em_breve: "Em breve",
  encerrado: "Encerrado",
};

export const SITUACAO_EMPRESA: Record<string, string> = {
  incubada: "Incubada",
  graduada: "Graduada",
  associada: "Associada",
};

export function paragraphs(content?: string | null): string[] {
  if (!content) return [];
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
