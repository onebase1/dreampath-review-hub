import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ContentFilters from "@/components/ContentFilters";
import ContentCard from "@/components/ContentCard";
import StatsSummary from "@/components/StatsSummary";
import { fetchAirtableContent } from "@/services/airtableService";
import { updateAirtableContentStatus } from "@/services/airtableService";
import { ContentItem, ContentStats } from "@/types/content";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSort, setSelectedSort] = useState("date-new");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const items = await fetchAirtableContent();
        setContentItems(items);
        
        // Calculate stats from the fetched items
        const statsData: ContentStats = {
          total: items.length,
          pending: items.filter(item => item.status === 'pending').length,
          approved: items.filter(item => item.status === 'approved').length,
          rejected: items.filter(item => item.status === 'rejected').length
        };
        
        setStats(statsData);
        
        toast({
          title: "Data loaded successfully",
          description: `Loaded ${items.length} content items from Airtable`,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to fetch content from Airtable",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  useEffect(() => {
    // Filter content items based on selected type
    let filtered = contentItems;
    if (selectedType !== "all") {
      filtered = contentItems.filter(item => item.type === selectedType);
    }

    // Sort content items based on selected sort option
    switch (selectedSort) {
      case "date-new":
        filtered = [...filtered].sort((a, b) => 
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
        break;
      case "date-old":
        filtered = [...filtered].sort((a, b) => 
          new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
        );
        break;
      case "urgency":
        filtered = [...filtered].sort((a, b) => 
          a.urgency === "high" ? -1 : b.urgency === "high" ? 1 : 0
        );
        break;
      default:
        break;
    }

    setFilteredItems(filtered);
  }, [contentItems, selectedType, selectedSort]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      // Update Airtable first
      const success = await updateAirtableContentStatus(id, status);
      
      if (success) {
        // Update local state after successful API call
        const updatedItems = contentItems.map(item => 
          item.id === id ? { ...item, status } : item
        );
        setContentItems(updatedItems);

        // Update stats
        if (stats) {
          const newStats = { ...stats };
          newStats.pending = Math.max(0, newStats.pending - 1);
          
          if (status === 'approved') {
            newStats.approved += 1;
          } else if (status === 'rejected') {
            newStats.rejected += 1;
          }
          
          setStats(newStats);
        }

        toast({
          title: `Content ${status}`,
          description: `The content has been ${status} successfully`,
        });
      } else {
        throw new Error("Failed to update content status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: `Failed to ${status} content`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header pendingCount={stats?.pending || 0} />
      
      <main className="container mx-auto p-4 space-y-6 pb-20 max-w-7xl">
        <h2 className="text-2xl font-semibold text-gray-800">Content Review Dashboard</h2>
        
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-20 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          </>
        ) : (
          <>
            {stats && <StatsSummary stats={stats} />}
            
            <ContentFilters
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
            
            {filteredItems.length === 0 ? (
              <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700">No content items to review</h3>
                <p className="text-gray-500 mt-2">
                  {selectedType !== "all" 
                    ? `No ${selectedType} content items available. Try selecting a different content type.`
                    : "You're all caught up! Check back later for new content to review."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ContentCard 
                    key={item.id}
                    item={item}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
