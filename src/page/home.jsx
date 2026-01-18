import { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { PageShell } from "../components/layout/PageShell";
import { LoginSplash } from "../components/auth/LoginSplash";
import { Frame } from "../components/ui/Frame";
import { SectionHeader } from "../components/ui/SectionHeader";
import { SplashOverlay } from "../components/ui/SplashOverlay";
import { Surface } from "../components/ui/Surface";
import { TextInput } from "../components/ui/TextInput";
import { navigateTo } from "../utils/navigation";

export const HomePageWithLogin = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showRecovery, setShowRecovery] = useState(false);

    useEffect(() => {
        if (!isLoggingIn) return;
        const timer = setTimeout(() => {
            navigateTo("/dashboard");
        }, 900);

        return () => clearTimeout(timer);
    }, [isLoggingIn]);

    const handleLogin = () => {
        if (isLoggingIn) return;
        setShowRecovery(false);
        setIsLoggingIn(true);
    };

    return (
        <PageShell padding="lg" className="relative flex flex-col items-center gap-10 font-body">
            <PageContainer className="flex flex-col items-center gap-10">
                <div className="flex w-full max-w-4xl flex-col items-center gap-6">
                    <SectionHeader
                        title="CUERPO DE INVESTIGACIONES CIENTÍFICAS, PENALES Y CRIMINALÍSTICAS"
                        subtitle="División de Criminalística Municipal Maracaibo"
                        titleClassName="font-brand text-2xl uppercase tracking-[0.08em] sm:text-3xl"
                        subtitleClassName="font-body text-base sm:text-lg"
                        align="center"
                        className="max-w-4xl"
                    />
                </div>

                <div className="flex w-full flex-col items-center gap-10">
                    {!showRecovery ? (
                        <Surface variant="glass" className="w-full max-w-md text-white">
                            <div className="flex flex-col gap-6 px-6 py-8 sm:px-8">
                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-semibold text-white font-brand">
                                        Iniciar Sesión
                                    </h1>
                                    <p className="text-sm text-blue-100">
                                        Ingrese sus credenciales para acceder al sistema
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <TextInput
                                        label="Usuario"
                                        placeholder="Ingrese su usuario"
                                        variant="glass"
                                        labelTone="light"
                                    />
                                    <TextInput
                                        label="Contraseña"
                                        placeholder="Ingrese su contraseña"
                                        type="password"
                                        variant="glass"
                                        labelTone="light"
                                    />

                                    <div className="flex items-center justify-between text-sm text-blue-100">
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-400 focus:ring-indigo-300"
                                            />
                                            <span>Recordarme</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="font-medium text-blue-100 hover:text-white"
                                            onClick={() => setShowRecovery(true)}
                                        >
                                            ¿Olvidó su contraseña?
                                        </button>
                                    </div>

                                    <Frame
                                        className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
                                        onClick={handleLogin}
                                        disabled={isLoggingIn}
                                    >
                                        Ingresar
                                    </Frame>
                                </div>
                            </div>
                        </Surface>
                    ) : (
                        <Surface variant="glass" className="w-full max-w-md text-white">
                            <div className="flex flex-col gap-6 px-6 py-8 sm:px-8">
                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-semibold text-white font-brand">
                                        Enviar correo
                                    </h1>
                                    <p className="text-sm text-blue-100">
                                        Complete la verificación para recuperar el acceso.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <TextInput
                                        label="Correo"
                                        placeholder="Ingrese su correo"
                                        type="email"
                                        variant="glass"
                                        labelTone="light"
                                    />
                                    <TextInput
                                        label="Pregunta de seguridad"
                                        placeholder="Ingrese su pregunta de seguridad"
                                        variant="glass"
                                        labelTone="light"
                                    />

                                    <Frame className="w-full justify-center" type="button">
                                        Enviar correo
                                    </Frame>
                                    <Frame
                                        variant="ghost"
                                        className="w-full justify-center"
                                        type="button"
                                        onClick={() => setShowRecovery(false)}
                                    >
                                        Volver al inicio
                                    </Frame>
                                </div>
                            </div>
                        </Surface>
                    )}
                </div>
            </PageContainer>
            <SplashOverlay isVisible={isLoggingIn}>
                <LoginSplash />
            </SplashOverlay>
        </PageShell>
    );
};
