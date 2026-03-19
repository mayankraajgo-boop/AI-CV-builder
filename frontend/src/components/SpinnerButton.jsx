/**
 * Reusable button with built-in loading spinner.
 * Props: text, loading, onClick, className, type, icon, variant, disabled
 */
export default function SpinnerButton({
  text = 'Submit',
  loading = false,
  onClick,
  className = '',
  type = 'button',
  icon,
  variant = 'primary',
  disabled = false,
  style = {},
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
      style={{ position: 'relative', transition: 'all 0.2s', ...style }}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          Please wait...
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`} />}
          {text}
        </>
      )}
    </button>
  );
}
