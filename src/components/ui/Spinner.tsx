export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[size];
  return (
    <div
      className={`${sizeClass} rounded-full border-2 border-white/10 border-t-indigo-400 animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
