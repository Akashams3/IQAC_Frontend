import { ACADEMIC_YEAR_FILTER_OPTIONS } from "../utils/academicYear";

/**
 * Shared filters: "All years" / "All semesters" plus common presets.
 */
export default function AcademicYearSemesterFilter({
  academicYear,
  semester,
  onAcademicYear,
  onSemester,
  showSemester = true,
  className = "",
}) {
  const sel =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[11rem]";

  return (
    <div
      className={`flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 ${className}`}
      role="search"
    >
      <span className="self-center text-sm font-semibold text-slate-600">Filters</span>
      <div>
        <label htmlFor="filter-academic-year" className="mb-1 block text-xs font-medium text-slate-500">
          Academic year
        </label>
        <select
          id="filter-academic-year"
          className={sel}
          value={academicYear}
          onChange={(e) => onAcademicYear(e.target.value)}
        >
          <option value="">All years</option>
          {ACADEMIC_YEAR_FILTER_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {showSemester && (
        <div>
          <label htmlFor="filter-semester" className="mb-1 block text-xs font-medium text-slate-500">
            Semester
          </label>
          <select
            id="filter-semester"
            className={sel}
            value={semester}
            onChange={(e) => onSemester(e.target.value)}
          >
            <option value="">All semesters</option>
            <option value="ODD">ODD</option>
            <option value="EVEN">EVEN</option>
          </select>
        </div>
      )}
    </div>
  );
}
