import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
};

const StatsCard = ({
  bgColor,
  icon: Icon,
  iconColor,
  label,
  value,
}: StatsCardProps) => {
  return (
    <Card className="transition-colors bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/80">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`size-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-zinc-400">{label}</p>
            <p className="text-xl font-bold sm:text-2xl">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default StatsCard;
