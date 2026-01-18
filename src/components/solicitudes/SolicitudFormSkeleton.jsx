import { Skeleton } from "../ui/Skeleton";

const SkeletonField = () => (
    <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export const SolicitudFormSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-4 w-44" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <SkeletonField />
                    <SkeletonField />
                    <SkeletonField />
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-40" />
            </div>
        </div>
    );
};
