export default function Select({ label, options, error, className = '', ...props }) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <select
                className={`w-full px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-colors appearance-none
          ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-clinical-blue focus:ring-clinical-light'
                    }`}
                {...props}
            >
                <option value="" disabled>Selecciona una opción</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
