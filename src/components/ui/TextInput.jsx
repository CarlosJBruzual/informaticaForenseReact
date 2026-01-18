export const TextInput = ({ label, placeholder, type = "text" }) => {
    return (
        <label className="flex w-full flex-col gap-2 text-sm text-slate-800">
            <span className="font-medium text-slate-700">{label}</span>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
        </label>
    );
};
