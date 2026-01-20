import { useState } from "react";
import { Surface } from "../ui/Surface";
import { TextInput } from "../ui/TextInput";
import { TextAreaField } from "../ui/TextAreaField";
import { Frame } from "../ui/Frame";
import { fetchEvidenciasByExpediente } from "../../services/solicitudesService";

const initialState = {
	numeroMemo: "",
	expediente: "",
	prcc: "",
	fechaRecepcion: "",
	recibidoPor: "",
	descripcionEvidencia: "",
};

export const EvidenciasResguardoForm = ({ onSubmitRecord }) => {
	const [formData, setFormData] = useState(initialState);
	const [status, setStatus] = useState("");
	const [lookupMessage, setLookupMessage] = useState("");
	const [isLookingUp, setIsLookingUp] = useState(false);

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (onSubmitRecord) {
			onSubmitRecord(formData);
		}
		setStatus("Remisión registrada localmente (demo)");
	};

	const handleLookupExpediente = async () => {
		setLookupMessage("");
		setStatus("");
		setIsLookingUp(true);
		const expediente = formData.expediente.trim();

		try {
			const data = await fetchEvidenciasByExpediente(expediente);
			if (data) {
				setFormData((prev) => ({
					...prev,
					prcc: data.prcc || "",
					descripcionEvidencia: data.descripcionEvidencia || "",
				}));
				setLookupMessage("Expediente encontrado; campos precargados.");
			} else {
				setLookupMessage("No se encontraron evidencias para este expediente.");
			}
		} catch (error) {
			setLookupMessage("No se pudo consultar el expediente (demo).");
		} finally {
			setIsLookingUp(false);
		}
	};

	const handleReset = () => {
		setFormData(initialState);
		setStatus("");
		setLookupMessage("");
	};

	return (
		<Surface variant="dark" className="rounded-xl border border-white/10 p-4 md:p-5">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<TextInput
						label="N° de memo"
						value={formData.numeroMemo}
						onValueChange={(value) => handleChange("numeroMemo", value)}
						required
						variant="glass"
						labelTone="light"
					/>
					<div className="flex flex-col gap-2">
						<TextInput
							label="Expediente"
							value={formData.expediente}
							onValueChange={(value) => handleChange("expediente", value)}
							required
							variant="glass"
							labelTone="light"
						/>
						<Frame
							variant="ghost"
							type="button"
							onClick={handleLookupExpediente}
							disabled={isLookingUp}
							className="w-fit"
						>
							{isLookingUp ? "Buscando..." : "Buscar expediente"}
						</Frame>
					</div>
					<TextInput
						label="PRCC"
						value={formData.prcc}
						onValueChange={(value) => handleChange("prcc", value)}
						required
						variant="glass"
						labelTone="light"
					/>
					<TextInput
						type="date"
						label="Fecha de recepción"
						value={formData.fechaRecepcion}
						onValueChange={(value) => handleChange("fechaRecepcion", value)}
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
				</div>

				<TextAreaField
					label="Descripción de evidencia"
					value={formData.descripcionEvidencia}
					onValueChange={(value) => handleChange("descripcionEvidencia", value)}
					placeholder="Detalle de la evidencia recibida en resguardo"
					required
					variant="glass"
					labelTone="light"
				/>

				<div className="flex flex-wrap justify-end gap-3">
					<Frame variant="ghost" className="px-6" type="button" onClick={handleReset}>
						Limpiar
					</Frame>
					<Frame variant="primary" className="px-6" type="submit">
						Registrar remisión
					</Frame>
				</div>

				{lookupMessage ? (
					<p className="text-sm text-blue-200">{lookupMessage}</p>
				) : null}

				{status ? <p className="text-sm text-green-200">{status}</p> : null}
			</form>
		</Surface>
	);
};
