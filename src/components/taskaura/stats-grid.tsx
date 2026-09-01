import { useI18n } from "@/lib/i18n";
import { useTaskAura } from "@/lib/taskaura/store";

export function StatsGrid() {
  const { stats } = useTaskAura();
  const { t } = useI18n();
  const rate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="aura-rise rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("stats.total")}
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h3 className="font-display text-4xl font-bold">{stats.total}</h3>
          <span className="rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
            {t("stats.active", { n: stats.active })}
          </span>
        </div>
      </div>

      <div className="aura-rise rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("stats.completed")}
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h3 className="font-display text-4xl font-bold">{stats.completed}</h3>
          <span className="text-xs font-medium text-muted-foreground">
            {t("stats.overdue", { n: stats.overdue })}
          </span>
        </div>
      </div>

      <div className="aura-rise rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("stats.score")}
        </p>
        <h3 className="mt-1 font-display text-4xl font-bold">{stats.score}%</h3>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-linear-to-r from-brand to-aura transition-[width] duration-700"
            style={{ width: `${stats.score}%`, boxShadow: "var(--shadow-aura)" }}
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {t("stats.dailyRate", { n: rate })}
        </p>
      </div>
    </section>
  );
}
