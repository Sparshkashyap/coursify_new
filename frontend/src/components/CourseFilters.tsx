import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { categories } from "@/data/mockData";

interface CourseFiltersProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceFilter: string;
  onPriceChange: (val: string) => void;
  minRating: number;
  onRatingChange: (val: number) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  selectedCategory, onCategoryChange, priceFilter, onPriceChange, minRating, onRatingChange,
}) => {
  return (
    <aside className="space-y-6 rounded-lg border bg-card p-5">
      <div>
        <h3 className="font-display font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={selectedCategory === cat}
                onCheckedChange={() => onCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-display font-semibold mb-3">Price</h3>
        <div className="space-y-2">
          {["All", "Free", "Paid"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={priceFilter === opt}
                onCheckedChange={() => onPriceChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-display font-semibold mb-3">Minimum Rating</h3>
        <Slider
          value={[minRating]}
          onValueChange={([val]) => onRatingChange(val)}
          max={5}
          min={0}
          step={0.5}
          className="mt-2"
        />
        <p className="mt-1 text-xs text-muted-foreground">{minRating}+ stars</p>
      </div>
    </aside>
  );
};

export default CourseFilters;
