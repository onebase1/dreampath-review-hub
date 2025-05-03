
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ContentStats } from "@/types/content";

const StatsSummary = ({ stats }: { stats: ContentStats }) => {
  const approvalRate = stats.total > 0 
    ? Math.round((stats.approved / stats.total) * 100) 
    : 0;
  
  const rejectionRate = stats.total > 0 
    ? Math.round((stats.rejected / stats.total) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Pending Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-dreampath-dark-purple">
            {stats.pending}
          </div>
          <p className="text-xs text-gray-500">items awaiting your decision</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Approval Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-dreampath-green">
            {approvalRate}%
          </div>
          <Progress value={approvalRate} className="h-2 bg-gray-100" />
          <p className="text-xs text-gray-500">{stats.approved} approved out of {stats.total}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Rejection Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-dreampath-red">
            {rejectionRate}%
          </div>
          <Progress value={rejectionRate} className="h-2 bg-gray-100" />
          <p className="text-xs text-gray-500">{stats.rejected} rejected out of {stats.total}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSummary;
