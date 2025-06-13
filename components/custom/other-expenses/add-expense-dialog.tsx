"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Edit, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { OtherExpense, ExpenseFormData } from "./types";

interface AddExpenseDialogProps {
  onAddExpense?: (expense: OtherExpense) => Promise<void>;
  onEditExpense?: (id: string, expense: Partial<OtherExpense>) => Promise<void>;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
  expense?: OtherExpense;
  trigger?: React.ReactNode;
}

export function AddExpenseDialog({
  onAddExpense,
  onEditExpense,
  isSubmitting = false,
  mode = "add",
  expense,
  trigger,
}: AddExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [amountInput, setAmountInput] = useState("");
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    description: "",
    branch: "",
  });

  // Form validation errors
  const [errors, setErrors] = useState<{
    date?: string;
    amount?: string;
    branch?: string;
    description?: string;
  }>({});

  // Format number to currency display
  const formatCurrencyInput = (value: number) => {
    if (value === 0) return "";
    return new Intl.NumberFormat("en-PH", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Parse currency string to number
  const parseCurrencyInput = (value: string) => {
    const cleanValue = value.replace(/[₱,\s]/g, "");
    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? 0 : numericValue;
  };

  // Handle amount input changes with better cursor handling
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    // Remove all non-numeric characters except decimal point
    let cleanValue = inputValue.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points - keep only the first one
    const decimalCount = (cleanValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      const firstDecimalIndex = cleanValue.indexOf(".");
      cleanValue =
        cleanValue.substring(0, firstDecimalIndex + 1) +
        cleanValue.substring(firstDecimalIndex + 1).replace(/\./g, "");
    }

    // Limit decimal places to 2
    const parts = cleanValue.split(".");
    if (parts[1] && parts[1].length > 2) {
      cleanValue = parts[0] + "." + parts[1].substring(0, 2);
    }

    // Update the input display value (show exactly what user types)
    setAmountInput(cleanValue);

    // Update the numeric value for form data
    const numericValue = parseFloat(cleanValue) || 0;
    setFormData({
      ...formData,
      amount: numericValue,
    });

    // Restore cursor position on next tick
    setTimeout(() => {
      if (e.target) {
        const newPosition = Math.min(cursorPosition, cleanValue.length);
        e.target.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Handle blur to optionally format the display value
  const handleAmountBlur = () => {
    // Only format if there's a decimal point but no decimal places
    if (amountInput.endsWith(".")) {
      setAmountInput(amountInput + "00");
    } else if (
      amountInput.includes(".") &&
      amountInput.split(".")[1].length === 1
    ) {
      setAmountInput(amountInput + "0");
    }
  };

  // Pre-populate form data when editing
  useEffect(() => {
    if (mode === "edit" && expense) {
      const expenseDate = new Date(expense.date);
      setSelectedDate(expenseDate);
      // Show raw value for editing without forced decimal places
      setAmountInput(
        expense.amount % 1 === 0
          ? expense.amount.toString()
          : expense.amount.toString()
      );
      setFormData({
        date: expense.date,
        amount: expense.amount,
        description: expense.description,
        branch: expense.branch,
      });
    } else {
      const today = new Date();
      setSelectedDate(today);
      setAmountInput("");
      setFormData({
        date: today.toISOString().split("T")[0],
        amount: 0,
        description: "",
        branch: "",
      });
    }
  }, [mode, expense, isOpen]);

  // Validate form fields
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Date validation
    if (!selectedDate) {
      newErrors.date = "Date is required";
    }

    // Amount validation
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    // Branch validation
    if (!formData.branch || formData.branch.trim() === "") {
      newErrors.branch = "Branch is required";
    }

    // Description is now optional - remove validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear error for specific field
  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({
        ...formData,
        date: date.toISOString().split("T")[0],
      });
      clearError("date");
      setIsDatePickerOpen(false); // Close the date picker when date is selected
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, branch: value });
    if (value.trim()) {
      clearError("branch");
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, description: value });
    // Remove error clearing since description is optional
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    if (mode === "edit" && expense && onEditExpense) {
      await onEditExpense(expense.id!, {
        date: formData.date || "",
        amount: Number(formData.amount),
        description: formData.description || "", // Allow empty description
        branch: formData.branch ?? "",
      });
    } else if (mode === "add" && onAddExpense) {
      const newExpense: OtherExpense = {
        date: formData.date || "",
        amount: Number(formData.amount),
        description: formData.description || "", // Allow empty description
        branch: formData.branch ?? "",
      };
      await onAddExpense(newExpense);
    }

    // Only reset form and close dialog if submission was successful
    if (!isSubmitting) {
      const today = new Date();
      setSelectedDate(today);
      setAmountInput("");
      setFormData({
        date: today.toISOString().split("T")[0],
        amount: 0,
        description: "",
        branch: "",
      });
      setErrors({});
      setIsOpen(false);
    }
  };

  // Reset errors when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const defaultTrigger = (
    <Button className="h-10" disabled={isSubmitting}>
      <Plus className="h-4 w-4 mr-2" />
      Add Expense
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the expense details below."
              : "Enter the details for the new expense entry."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        errors.date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm z-10">
                    ₱
                  </span>
                  <Input
                    id="amount"
                    type="text"
                    value={amountInput}
                    onChange={(e) => {
                      handleAmountChange(e);
                      if (
                        parseFloat(e.target.value.replace(/[^0-9.]/g, "")) > 0
                      ) {
                        clearError("amount");
                      }
                    }}
                    onBlur={handleAmountBlur}
                    className={cn("pl-8", errors.amount && "border-red-500")}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="branch" className="text-right">
                Branch <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="branch"
                  type="text"
                  value={formData.branch || ""}
                  onChange={handleBranchChange}
                  className={cn(errors.branch && "border-red-500")}
                  placeholder="Enter branch name"
                />
                {errors.branch && (
                  <p className="text-sm text-red-500 mt-1">{errors.branch}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter expense description... (optional)"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {mode === "edit" ? (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Update Expense
                    </>
                  ) : (
                    "Add Expense"
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
