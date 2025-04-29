
import React, { useState, useEffect } from 'react';
import { FormResponse, FormSection, User, FormData } from '../types/form';
import FormSectionComponent from './FormSection';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface DynamicFormProps {
  user: User;
  onLogout: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ user, onLogout }) => {
  const [formStructure, setFormStructure] = useState<FormResponse | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        const response = await fetch(`https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${user.rollNumber}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch form structure');
        }

        setFormStructure(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(errorMessage);
        onLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormStructure();
  }, [user, onLogout]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));

    // Clear the error for this field if it exists
    if (errors[fieldId]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSection): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    for (const field of section.fields) {
      const value = formData[field.fieldId];

      // Check required fields
      if (field.required && (value === undefined || value === null || value === '')) {
        newErrors[field.fieldId] = field.validation?.message || 'This field is required';
        isValid = false;
        continue;
      }

      // Skip further validation if field is empty and not required
      if ((value === undefined || value === null || value === '') && !field.required) {
        continue;
      }

      // Validate string fields
      if (typeof value === 'string') {
        // Min length validation
        if (field.minLength && value.length < field.minLength) {
          newErrors[field.fieldId] = field.validation?.message || `Minimum length is ${field.minLength} characters`;
          isValid = false;
        }

        // Max length validation
        if (field.maxLength && value.length > field.maxLength) {
          newErrors[field.fieldId] = field.validation?.message || `Maximum length is ${field.maxLength} characters`;
          isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.fieldId] = field.validation?.message || 'Please enter a valid email address';
          isValid = false;
        }

        // Tel validation (basic format check)
        if (field.type === 'tel' && value && !/^\+?[0-9\s-()]+$/.test(value)) {
          newErrors[field.fieldId] = field.validation?.message || 'Please enter a valid phone number';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!formStructure) return;

    const currentSection = formStructure.form.sections[currentSectionIndex];
    if (!validateSection(currentSection)) {
      toast.error("Please fix the errors before proceeding");
      return;
    }

    setCurrentSectionIndex(currentSectionIndex + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    if (!formStructure) return;

    const currentSection = formStructure.form.sections[currentSectionIndex];
    if (!validateSection(currentSection)) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Form submission logic
    console.log('Form submitted with data:', formData);
    toast.success("Form submitted successfully! Check the console for form data.");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!formStructure) {
    return (
      <div className="text-center p-8">
        <p className="text-lg mb-4">Failed to load form structure.</p>
        <Button onClick={onLogout}>Back to Login</Button>
      </div>
    );
  }

  const currentSection = formStructure.form.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === formStructure.form.sections.length - 1;
  const progress = ((currentSectionIndex + 1) / formStructure.form.sections.length) * 100;

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto pb-10">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>{formStructure.form.formTitle}</CardTitle>
            <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            User: {user.name} (Roll: {user.rollNumber})
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Section {currentSectionIndex + 1} of {formStructure.form.sections.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <FormSectionComponent
        section={currentSection}
        formData={formData}
        onChange={handleFieldChange}
        errors={errors}
      />

      <div className="flex justify-between pt-2">
        <Button 
          onClick={handlePrev} 
          disabled={currentSectionIndex === 0}
          variant="outline"
          className="min-w-[100px]"
        >
          Previous
        </Button>
        
        {isLastSection ? (
          <Button 
            onClick={handleSubmit}
            className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
