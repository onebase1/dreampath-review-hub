
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/types/content";

interface ContentFiltersProps {
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
}

const ContentFilters = ({
  selectedType,
  onTypeChange,
  selectedSort,
  onSortChange,
}: ContentFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Content Type</label>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Date (Newest)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-new">Date (Newest)</SelectItem>
            <SelectItem value="date-old">Date (Oldest)</SelectItem>
            <SelectItem value="urgency">Urgency</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContentFilters;
