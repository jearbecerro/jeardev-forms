
export function getColClass(width: number = 24) {
  // Accepts width: 1..24, returns Tailwind class and style for correct gutter/grid.
  if (width < 1) width = 1;
  if (width > 24) width = 24;
  const percent = (width / 24) * 100;
  // -mx-3 on row, px-3 on col = 24px horizontal gutter
  return {
    className: `basis-[${percent}%] max-w-[${percent}%] px-3 pb-4`,
    style: { flexBasis: `${percent}%`, maxWidth: `${percent}%` },
  };
}
