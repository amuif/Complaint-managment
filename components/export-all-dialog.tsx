'use client';
import { Download, FileSpreadsheet, File, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import { reportExportApi } from '@/lib/api';

const ExportAllDialog = () => {
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

  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'csv' | 'excel'>('csv');
  const [open, setOpen] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await reportExportApi.reportExport(format);
      handleApiSuccess(`Report exported successfully!`);
      setOpen(false);
    } catch (error: any) {
      console.error('Export error:', error);
      handleApiError(error.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto rounded-full" variant="default">
            <Download className="mr-2 h-4 w-4" />
            Export report
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export report</DialogTitle>
            <DialogDescription>
              Choose your preferred format and options for exporting
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
    </div>
  );
};

export default ExportAllDialog;
