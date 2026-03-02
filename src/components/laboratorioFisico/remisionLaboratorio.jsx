import { useState } from "react";
import { Surface } from "../ui/Surface";
import { TextInput } from "../ui/TextInput";
import { TextAreaField } from "../ui/TextAreaField";
import { Frame } from "../ui/Frame";
import { createRemisionLaboratorio } from "../../services/laboratorioService";

const initialState = {
	numeroRemision: "",
	fechaRemision: "",
	expediente: "",
	prcc: "",
	descripcionEvidencia: "",
	recibidoPor: "",
};

export const RemisionLaboratorioForm = ({ onSubmitRecord, remitidoPor }) => {
	const [formData, setFormData] = useState(initialState);
	const [status, setStatus] = useState("");
	const [submitError, setSubmitError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSubmitError("");
		setStatus("");
		setIsSubmitting(true);
		try {
			const result = await createRemisionLaboratorio({
				numeroRemision: formData.numeroRemision,
				fechaRemision: formData.fechaRemision,
				expediente: formData.expediente,
				prcc: formData.prcc,
				descripcion: formData.descripcionEvidencia,
				recibidoPor: formData.recibidoPor,
				remitidoPor: remitidoPor || formData.recibidoPor,
			});
			onSubmitRecord?.(result?.remision || result);
			setStatus("Remisión registrada");
			setFormData(initialState);
		} catch (error) {
			setSubmitError(error?.message || "No se pudo registrar la remisión.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReset = () => {
		setFormData(initialState);
		setStatus("");
		setSubmitError("");
	};

	return (
		<Surface variant="dark" className="rounded-xl border border-white/10 p-4 md:p-5">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<TextInput
						label="N° de Remisión"
						value={formData.numeroRemision}
						onValueChange={(value) => handleChange("numeroRemision", value)}
						required
						variant="glass"
						labelTone="light"
					/>
					<TextInput
						type="date"
						label="Fecha de Remisión"
						value={formData.fechaRemision}
						onValueChange={(value) => handleChange("fechaRemision", value)}
						required
						variant="glass"
						labelTone="light"
					/>
					<TextInput
						label="Expediente"
						value={formData.expediente}
						onValueChange={(value) => handleChange("expediente", value)}
						required
						variant="glass"
						labelTone="light"
					/>
					<TextInput
						label="PRCC"
						value={formData.prcc}
						onValueChange={(value) => handleChange("prcc", value)}
						required
						variant="glass"
						labelTone="light"
					/>
				</div>

				<TextAreaField
					label="Descripción de la evidencia remitida"
					value={formData.descripcionEvidencia}
					onValueChange={(value) => handleChange("descripcionEvidencia", value)}
					placeholder="Detalle de la evidencia derivada remitida al laboratorio físico"
					required
					variant="glass"
					labelTone="light"
				/>

				<TextInput
					label="Recibido por"
					value={formData.recibidoPor}
					onValueChange={(value) => handleChange("recibidoPor", value)}
					required
					variant="glass"
					labelTone="light"
				/>

				<div className="flex flex-wrap justify-end gap-3">
					<Frame variant="ghost" className="px-6" type="button" onClick={handleReset}>
						Limpiar
					</Frame>
					<Frame variant="primary" className="px-6" type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Guardando..." : "Registrar remisión"}
					</Frame>
				</div>

				{submitError ? <p className="text-sm text-red-200">{submitError}</p> : null}
				{status ? <p className="text-sm text-green-200">{status}</p> : null}
			</form>
		</Surface>
	);
};
