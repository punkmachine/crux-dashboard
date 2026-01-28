import type { Site } from "../types/site.js";
import { createElement, formatDate } from "../utils/dom.js";

export function createSiteItem(
  site: Site,
  onEdit: (site: Site) => void,
): HTMLElement {
  const row = createElement("tr", "site-item");

  const urlCell = createElement("td", "site-item__url");
  urlCell.textContent = site.url;

  const nameCell = createElement("td", "site-item__name");
  nameCell.textContent = site.name;

  const statusCell = createElement("td", "site-item__status");
  const statusBadge = createElement(
    "span",
    `site-item__badge site-item__badge--${site.isActive ? "active" : "inactive"}`,
  );
  statusBadge.textContent = site.isActive ? "Активен" : "Неактивен";
  statusCell.appendChild(statusBadge);

  const dateCell = createElement("td", "site-item__date");
  dateCell.textContent = formatDate(site.createdAt);

  const actionsCell = createElement("td", "site-item__actions");
  const editButton = createElement("button", "site-item__edit-button");
  editButton.textContent = "Редактировать";
  editButton.type = "button";
  editButton.addEventListener("click", () => onEdit(site));
  actionsCell.appendChild(editButton);

  row.appendChild(urlCell);
  row.appendChild(nameCell);
  row.appendChild(statusCell);
  row.appendChild(dateCell);
  row.appendChild(actionsCell);

  return row;
}
