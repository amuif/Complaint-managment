'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/components/language-provider';
import { exportApi } from '@/lib/api';
import { toast } from 'sonner';

interface ExportDialogProps {
  dataType: 'complaints' | 'employees' | 'feedback';
  filters?: Record<string, any>;
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export function ExportDialog({
  dataType,
  filters,
  triggerText,
  triggerVariant = 'outline',
}: ExportDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('csv');
  const [includeFilters, setIncludeFilters] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Comma-separated values file',
      icon: FileText,
      color: 'text-green-600',
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel spreadsheet',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
    },
  ] as const;

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'complaints':
        return 'Complaints';
      case 'employees':
        return 'Employees';
      case 'feedback':
        return 'Feedback';
      default:
        return 'Data';
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportFilters = includeFilters ? filters : undefined;

      switch (dataType) {
        case 'complaints':
          await exportApi.exportComplaints(format, exportFilters);
          break;
        case 'employees':
          await exportApi.exportEmployees(format, exportFilters);
          break;
        case 'feedback':
          await exportApi.exportFeedback(format, exportFilters);
          break;
      }

      toast.success(`${getDataTypeLabel()} exported successfully!`);
      setOpen(false);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getActiveFiltersCount = () => {
    if (!filters) return 0;
    return Object.values(filters).filter((value) => value && value !== 'all' && value !== '')
      .length;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto rounded-full" variant={triggerVariant}>
          <Download className="mr-2 h-4 w-4" />
          {triggerText || `Export ${getDataTypeLabel()}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export {getDataTypeLabel()}</DialogTitle>
          <DialogDescription>
            Choose your preferred format and options for exporting{' '}
            {getDataTypeLabel().toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as any)}>
              {formatOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <option.icon className={`h-4 w-4 ${option.color}`} />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Filter Options */}
          {filters && getActiveFiltersCount() > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-filters"
                  checked={includeFilters}
                  onCheckedChange={(checked) => setIncludeFilters(checked === true)}
                />
                <Label htmlFor="include-filters" className="text-sm cursor-pointer">
                  Apply current filters ({getActiveFiltersCount()} active)
                </Label>
              </div>
              {includeFilters && (
                <div className="text-xs text-muted-foreground pl-6">
                  Only data matching your current filters will be exported.
                </div>
              )}
            </div>
          )}

          {/* Preview Info */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium">Export Preview</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Format: {formatOptions.find((f) => f.value === format)?.label}</div>
              <div>• Filters: {includeFilters && filters ? 'Applied' : 'None'}</div>
              <div>• Data: {getDataTypeLabel()}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleExport} disabled={isExporting}>
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
