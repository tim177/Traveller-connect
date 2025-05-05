import { Escalation } from "@/lib/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { getCategoryIcon, getStatusColor } from "@/lib/escalation-utils";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "../ui/badge";

interface EscalationListprops {
  escalations: Escalation[];
  onSelectEscalation: (escalation: Escalation) => void;
}

export default function EscalationList({
  escalations,
  onSelectEscalation,
}: EscalationListprops) {
  if (escalations.length === 0)
    return (
      <div className="rounded-lg border border-dashed border-teal-300 bg-white/50 p-8 text-center">
        <p className="text-muted-foreground">No Escalation found</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {escalations.map((escalation) => (
        <Card
          key={escalation.id}
          onClick={() => onSelectEscalation(escalation)}
          className="cursor-pointer overflow-hidden border-teal-200 bg-white/90 transition-all hover:shadow-md"
        >
          <CardHeader className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                {getCategoryIcon(escalation.category)}
              </div>
              <div>
                <h3 className="font-medium">{escalation.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(escalation.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(escalation.status)}>
              {escalation.status}
            </Badge>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {escalation.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
