export const BooleanControl = ({ label, value, onChange, disabled }) => (
    <div className={`flex items-center justify-between mb-2 ${disabled ? 'opacity-40' : ''}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div
            onClick={disabled ? undefined : () => onChange(!value)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${value ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </div>
    </div>
);

export const SelectControl = ({ label, value, options, onChange, disabled }) => (
    <div className={`mb-2 ${disabled ? 'opacity-40' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full bg-gray-100 border-none rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 ${disabled ? 'cursor-not-allowed' : ''}`}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);
