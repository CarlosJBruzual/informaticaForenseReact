import { Frame } from "./Frame";
import { SplashOverlay } from "./SplashOverlay";
import { Surface } from "./Surface";

export const ConfirmDialog = ({
    isOpen,
    title = "Confirmar acción",
    message = "¿Está seguro de continuar?",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
    className = "",
}) => {
    return (
        <SplashOverlay isVisible={isOpen}>
            <Surface
                variant="glass"
                className={`w-full max-w-md p-6 text-white ${className}`.trim()}
            >
                <div className="flex flex-col gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-sm text-blue-100">{message}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-3">
                        <Frame
                            variant="ghost"
                            className="px-6"
                            type="button"
                            onClick={onCancel}
                        >
                            {cancelLabel}
                        </Frame>
                        <Frame
                            variant="primary"
                            className="px-6"
                            type="button"
                            onClick={onConfirm}
                        >
                            {confirmLabel}
                        </Frame>
                    </div>
                </div>
            </Surface>
        </SplashOverlay>
    );
};
