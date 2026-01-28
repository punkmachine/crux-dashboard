import type { Period, GroupBy } from "../services/metrics.api.js";

export interface ChartControlsCallbacks {
  onPeriodChange: (period: Period) => void;
  onGroupByChange: (groupBy: GroupBy) => void;
}

export interface ChartControlsState {
  period: Period;
  groupBy: GroupBy;
}

/**
 * Создает селекты для управления графиком (период и группировка).
 *
 * @param state - Текущее состояние селектов
 * @param callbacks - Колбэки для обработки изменений
 * @returns DOM-элемент с селектами
 */
export function createChartControls(
  state: ChartControlsState,
  callbacks: ChartControlsCallbacks,
): HTMLElement {
  const container = document.createElement("div");
  container.className = "chart-controls";

  // Селект группировки
  const groupByContainer = document.createElement("div");
  groupByContainer.className = "chart-controls__item";

  const groupByLabel = document.createElement("label");
  groupByLabel.className = "chart-controls__label";
  groupByLabel.textContent = "Группировка:";
  groupByLabel.setAttribute("for", "group-by-select");

  const groupBySelect = document.createElement("select");
  groupBySelect.id = "group-by-select";
  groupBySelect.className = "chart-controls__select";

  const groupByOptions: { value: GroupBy; label: string }[] = [
    { value: "day", label: "По дням" },
    { value: "week", label: "По неделям" },
    { value: "month", label: "По месяцам" },
  ];

  for (const option of groupByOptions) {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    if (option.value === state.groupBy) {
      optionElement.selected = true;
    }
    groupBySelect.appendChild(optionElement);
  }

  groupBySelect.addEventListener("change", () => {
    callbacks.onGroupByChange(groupBySelect.value as GroupBy);
  });

  groupByContainer.appendChild(groupByLabel);
  groupByContainer.appendChild(groupBySelect);

  // Селект периода
  const periodContainer = document.createElement("div");
  periodContainer.className = "chart-controls__item";

  const periodLabel = document.createElement("label");
  periodLabel.className = "chart-controls__label";
  periodLabel.textContent = "Период:";
  periodLabel.setAttribute("for", "period-select");

  const periodSelect = document.createElement("select");
  periodSelect.id = "period-select";
  periodSelect.className = "chart-controls__select";

  const periodOptions: { value: Period; label: string }[] = [
    { value: "1m", label: "1 месяц" },
    { value: "3m", label: "3 месяца" },
    { value: "6m", label: "6 месяцев" },
    { value: "1y", label: "1 год" },
  ];

  for (const option of periodOptions) {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    if (option.value === state.period) {
      optionElement.selected = true;
    }
    periodSelect.appendChild(optionElement);
  }

  periodSelect.addEventListener("change", () => {
    callbacks.onPeriodChange(periodSelect.value as Period);
  });

  periodContainer.appendChild(periodLabel);
  periodContainer.appendChild(periodSelect);

  container.appendChild(groupByContainer);
  container.appendChild(periodContainer);

  return container;
}
