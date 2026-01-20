import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Surface } from "../../components/ui/Surface";
import { Frame } from "../../components/ui/Frame";
import { TextInput } from "../../components/ui/TextInput";
import { TextAreaField } from "../../components/ui/TextAreaField";
import { EvidenciasResguardoForm } from "../../components/resguardo/evidenciasResguado";

export const Resguardo = ({ activePath }) => {
    return (
        <DashboardLayout activePath={activePath} contentWidth="contained" contentPadding="sm">
            <Surface variant="glass" className="p-6 text-white">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">Remisión a Sala de Resguardo</h2>
                    <p className="text-sm text-blue-100">
                        Registra la entrega de evidencias a la sala de resguardo con los datos obligatorios.
                    </p>
                </div>

                <div className="mt-4">
                    <EvidenciasResguardoForm />
                </div>
            </Surface>
        </DashboardLayout>
    );
};
