const cn = (...classes) => classes.filter(Boolean).join(' ');

function Alert({ children, className, variant = 'default', font, ...props }) {
  return <div {...props} role={props.role || (variant === 'destructive' ? 'alert' : 'status')} className={cn('notice', `notice-${variant}`, font === 'retro' && 'font-mono', className)}>{children}</div>;
}
function AlertTitle({ className, ...props }) {
  return <div className={cn('notice-title', className)} {...props}/>;
}
function AlertDescription({ className, ...props }) {
  return <div className={cn('notice-description', className)} {...props}/>;
}
export { Alert, AlertTitle, AlertDescription };
export default Alert;
