import { Languages } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, useI18n, type Language } from "@/lib/i18n";

export function LanguageSelect() {
  const { lang, setLang, t } = useI18n();

  return (
    <Select value={lang} onValueChange={(v) => setLang(v as Language)}>
      <SelectTrigger
        aria-label={t("language.label")}
        className="h-11 w-[7.5rem] rounded-full border-border bg-surface text-xs font-medium"
      >
        <Languages className="size-4 shrink-0 text-brand" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code} className="text-sm">
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
