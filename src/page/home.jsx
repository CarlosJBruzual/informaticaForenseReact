import { Card } from "../components/ui/Card";
import { Frame } from "../components/ui/Frame";
import { SectionHeader } from "../components/ui/SectionHeader";
import { TextInput } from "../components/ui/TextInput";

export const HomePageWithLogin = () => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-midnight via-indigoMid to-slateDeep px-6 py-12 flex flex-col items-center gap-10">
            <SectionHeader
                title="CUERPO DE INVESTIGACIONES CIENTÍFICAS, PENALES Y CRIMINALÍSTICAS"
                subtitle="División de Criminalística Municipal Maracaibo"
            />

            <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-12 lg:flex-row">
                <img
                    src="/Image.png"
                    alt="CICPC"
                    className="hidden h-80 w-80 object-contain lg:block"
                />

                <Card>
                    <div className="flex flex-col gap-6 px-8 py-8">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold text-slate-900">Iniciar Sesión</h1>
                            <p className="text-sm text-slate-600">
                                Ingrese sus credenciales para acceder al sistema
                            </p>
                        </div>

                        <div className="space-y-4">
                            <TextInput label="Usuario" placeholder="Ingrese su usuario" />
                            <TextInput
                                label="Contraseña"
                                placeholder="Ingrese su contraseña"
                                type="password"
                            />

                            <div className="flex items-center justify-between text-sm text-slate-600">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                                    />
                                    <span>Recordarme</span>
                                </label>
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    ¿Olvidó su contraseña?
                                </a>
                            </div>

                            <Frame
                                className="w-full justify-center"
                                onClick={() => {
                                    window.location.pathname = "/dashboard/solicitudes";
                                }}
                            >
                                Ingresar
                            </Frame>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
