import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Surface } from "../../components/ui/Surface";

export const DashboardSection = ({ activePath, title, description }) => {
    return (
        <DashboardLayout activePath={activePath}>
            <Surface variant="glass" className="p-6 text-white">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-blue-100">{description}</p>
            </Surface>
        </DashboardLayout>
    );
};
