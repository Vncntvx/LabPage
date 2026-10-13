// Course metadata shared by the teaching catalog's cards and the course detail
// page. Both read the same fields from the same `courses` label set, so the
// label/value list is built here rather than twice with a drifting subset.

/** A definition-list row rendered by `MetaList`. */
export interface MetaPair {
  label: string;
  value: string;
}

/** The course fields a meta row can be built from. */
export interface CourseMeta {
  term?: string;
  year: number;
  instructor?: string;
  location?: string;
  time?: string;
}

/** The `strings(locale).courses` labels these rows are titled with. */
export interface CourseMetaLabels {
  instructor: string;
  location: string;
  time: string;
  term: string;
}

/**
 * The label/value rows for a course.
 *
 * Optional fields are skipped rather than rendered as an empty label: with no
 * `instructor` set, "Instructor" above nothing reads as missing data. The term
 * row is the same rule applied to `term`, which is optional too.
 *
 * `withTerm` is the one difference between the two callers: the catalog card
 * shows the term beside the title already, while the detail page's meta list is
 * the only place its term appears, so it folds it in as a row (`term year`).
 */
export const courseMetaPairs = (course: CourseMeta, labels: CourseMetaLabels, { withTerm = false } = {}): MetaPair[] => {
  const pairs: MetaPair[] = [];
  if (course.instructor) pairs.push({ label: labels.instructor, value: course.instructor });
  if (withTerm && course.term) pairs.push({ label: labels.term, value: `${course.term} ${course.year}` });
  if (course.location) pairs.push({ label: labels.location, value: course.location });
  if (course.time) pairs.push({ label: labels.time, value: course.time });
  return pairs;
};
