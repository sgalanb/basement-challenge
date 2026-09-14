const CORNERS = [
  "-top-px -left-px",
  "-top-px -right-px",
  "-bottom-px -left-px",
  "-bottom-px -right-px",
];

export function CornerMarks() {
  return CORNERS.map((corner) => (
    <span
      key={corner}
      aria-hidden="true"
      className={`bg-basement-white absolute size-px ${corner}`}
    />
  ));
}
