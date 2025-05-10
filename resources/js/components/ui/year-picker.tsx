import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";

interface YearPickerProps {
    year?: number;
    onYearChange?: (year: number) => void;
    className?: string;
    disabled?: boolean;
}

export function YearPicker({
    year,
    onYearChange,
    className,
    disabled = false
}: YearPickerProps) {
    const [selectedYear, setSelectedYear] = React.useState<number>(
        year || new Date().getFullYear()
    );
    const [yearRange, setYearRange] = React.useState<[number, number]>([
        selectedYear - 11,
        selectedYear
    ]);
    const [open, setOpen] = React.useState(false);

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        onYearChange?.(year);
        setOpen(false);
    };

    const handlePreviousYears = (e: React.MouseEvent) => {
        // Stop event propagation to prevent Dialog from closing
        e.stopPropagation();
        setYearRange([yearRange[0] - 12, yearRange[1] - 12]);
    };

    const handleNextYears = (e: React.MouseEvent) => {
        // Stop event propagation to prevent Dialog from closing
        e.stopPropagation();
        setYearRange([yearRange[0] + 12, yearRange[1] + 12]);
    };

    return (
        <Popover>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
    );
}
