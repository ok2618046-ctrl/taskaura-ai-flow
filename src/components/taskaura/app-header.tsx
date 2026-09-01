import { Link } from "@tanstack/react-router";
import { Moon, Plus, Sparkles, Sun } from "lucide-react";

import { AddTaskDialog } from "@/components/taskaura/add-task-dialog";
import { LanguageSelect } from "@/components/taskaura/language-select";
import { Button } from "@/components/ui/button";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

const NAV = [
  { to: "/", key: "nav.dashboard" },
  { to: "/parser", key: "nav.parser" },
  { to: "/solver", key: "nav.solver" },
  { to: "/analytics", key: "nav.analytics" },
] as const satisfies readonly { to: string; key: TranslationKey }[];

export function AppHeader() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:h-16 lg:py-0">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-brand to-aura aura-glow">
              <Sparkles className="size-4 text-brand-foreground" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">TaskAura</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-foreground" }}
                className="transition-colors hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelect />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
            className="min-h-11 min-w-11 rounded-full"
          >
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <AddTaskDialog
            trigger={
              <Button className="rounded-full bg-brand font-semibold text-brand-foreground shadow-lg shadow-brand/25 hover:bg-brand-light">
                <Plus className="size-4" />
                <span className="hidden sm:inline">{t("action.addTask")}</span>
              </Button>
            }
          />
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 text-xs font-medium text-muted-foreground lg:hidden">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: "bg-brand/10 text-brand" }}
            className="shrink-0 rounded-full px-3 py-1.5 transition-colors"
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
