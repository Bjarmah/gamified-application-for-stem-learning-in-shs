
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface FiltersProps {
  subjects: string[];
  difficulty: string;
  type: string[];
}

interface SearchFiltersProps {
  appliedFilters: FiltersProps;
  setAppliedFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
  onClose: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  appliedFilters,
  setAppliedFilters,
  onClose
}) => {
  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setAppliedFilters({
        ...appliedFilters,
        subjects: [...appliedFilters.subjects, subject]
      });
    } else {
      setAppliedFilters({
        ...appliedFilters,
        subjects: appliedFilters.subjects.filter(s => s !== subject)
      });
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setAppliedFilters({
        ...appliedFilters,
        type: [...appliedFilters.type, type]
      });
    } else {
      setAppliedFilters({
        ...appliedFilters,
        type: appliedFilters.type.filter(t => t !== type)
      });
    }
  };

  const handleDifficultyChange = (difficulty: string) => {
    setAppliedFilters({
      ...appliedFilters,
      difficulty
    });
  };

  const resetFilters = () => {
    setAppliedFilters({
      subjects: [],
      difficulty: "",
      type: []
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Separator />

      {/* Subject Filter */}
      <div className="space-y-3">
        <h4 className="font-medium">Subject</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"].map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={`subject-${subject}`}
                checked={appliedFilters.subjects.includes(subject)}
                onCheckedChange={(checked) => 
                  handleSubjectChange(subject, checked === true)
                }
              />
              <Label htmlFor={`subject-${subject}`} className="text-sm">{subject}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Content Type Filter */}
      <div className="space-y-3">
        <h4 className="font-medium">Content Type</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {["Module", "Quiz", "Lab"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={appliedFilters.type.includes(type)}
                onCheckedChange={(checked) => 
                  handleTypeChange(type, checked === true)
                }
              />
              <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Difficulty Filter */}
      <div className="space-y-3">
        <h4 className="font-medium">Difficulty</h4>
        <RadioGroup 
          value={appliedFilters.difficulty} 
          onValueChange={handleDifficultyChange}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Beginner" id="difficulty-beginner" />
              <Label htmlFor="difficulty-beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Intermediate" id="difficulty-intermediate" />
              <Label htmlFor="difficulty-intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Advanced" id="difficulty-advanced" />
              <Label htmlFor="difficulty-advanced">Advanced</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onClose}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default SearchFilters;
