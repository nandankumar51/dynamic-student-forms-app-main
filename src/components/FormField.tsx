
import React from 'react';
import { FormField as IFormField } from '../types/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  field: IFormField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(field.fieldId, e.target.value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(field.fieldId, checked);
  };

  const handleRadioChange = (value: string) => {
    onChange(field.fieldId, value);
  };

  const handleSelectChange = (value: string) => {
    onChange(field.fieldId, value);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
        return (
          <Input
            type={field.type}
            id={field.fieldId}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
            className={cn(error && 'border-red-500')}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={field.fieldId}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
            className={cn(error && 'border-red-500')}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            id={field.fieldId}
            value={value || ''}
            onChange={handleChange}
            required={field.required}
            data-testid={field.dataTestId}
            className={cn(error && 'border-red-500')}
          />
        );
      
      case 'dropdown':
        return (
          <Select 
            value={value || ''} 
            onValueChange={handleSelectChange}
          >
            <SelectTrigger 
              id={field.fieldId} 
              data-testid={field.dataTestId}
              className={cn(error && 'border-red-500')}
            >
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup 
            value={value || ''} 
            onValueChange={handleRadioChange}
            className="space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={field.fieldId}
              checked={!!value}
              onCheckedChange={handleCheckboxChange}
              data-testid={field.dataTestId}
            />
            <Label htmlFor={field.fieldId}>{field.label}</Label>
          </div>
        );
      
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {field.type !== 'checkbox' && (
        <Label htmlFor={field.fieldId} className="flex gap-1">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {renderField()}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
