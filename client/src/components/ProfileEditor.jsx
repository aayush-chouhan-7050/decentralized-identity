// src/components/ProfileEditor.jsx
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schemas/profileSchema';
import { useDebounce } from '../hooks/useDebounce';
import { FormInput } from './ui/FormInput';
import { StepIndicator } from './ui/StepIndicator';

import { User, Mail, Globe, Briefcase, Code, Hash, Link as LinkIcon, Building, ArrowRight, ArrowLeft, Loader, Save, Twitter, Github, Linkedin, GraduationCap, FileText, Calendar, Users, Flag } from 'lucide-react';

const getInitialValues = (existingProfile) => {
  const defaultValues = {
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "Male",
    nationality: "",
    profilePhoto: null,
    email: "",
    phoneNumber: "",
    residentialAddress: "",
    nationalIdType: "Aadhaar",
    nationalIdNumber: "",
    documentFile: null,
  };

  if (existingProfile) {
    // If there's an existing profile, merge it with the defaults
    // This ensures all fields are present, even if they're empty
    return { ...defaultValues, ...existingProfile };
  }

  const savedDraft = localStorage.getItem('profileDraft');
  if (savedDraft) {
    try {
      return JSON.parse(savedDraft);
    } catch (e) {
      return defaultValues;
    }
  }
  return defaultValues;
};

export default function ProfileEditor({ existingProfile, onSubmit, onCancel, loading, isNewProfile }) {
  const [currentStep, setCurrentStep] = useState(1);

  const { register, control, watch, trigger, getValues, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: getInitialValues(existingProfile),
    mode: 'onChange',
  });

  // **FIX: This useEffect hook will now correctly reset the form when you start editing**
  useEffect(() => {
    if (existingProfile) {
      reset(getInitialValues(existingProfile));
    }
  }, [existingProfile, reset]);

  // Debounce and save form to localStorage
  const watchedData = watch();
  const debouncedData = useDebounce(watchedData, 500);

  useEffect(() => {
    if (isNewProfile) {
      localStorage.setItem('profileDraft', JSON.stringify(debouncedData));
    }
  }, [debouncedData, isNewProfile]);

  const handleFinalSubmit = (data) => {
    onSubmit(data);
    localStorage.removeItem('profileDraft');
  };

  const triggerSubmit = async () => {
    const isFormValid = await trigger();
    if (isFormValid) {
      handleFinalSubmit(getValues());
    }
  };
  
  const handleNextStep = async () => {
    const fieldsToValidate = {
      1: ['fullName', 'username', 'dateOfBirth', 'gender', 'nationality', 'profilePhoto'],
      2: ['email', 'phoneNumber', 'residentialAddress'],
    }[currentStep];

    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <form className="form-wizard" noValidate>
      <div className="wizard-header">
        <h2>{isNewProfile ? 'Create Your Identity' : 'Update Your Identity'}</h2>
        <p>Your digital identity is secure and controlled by you.</p>
        <div className="step-indicators">
          <StepIndicator step={1} label="Personal" isActive={currentStep === 1} isCompleted={currentStep > 1} /> <div className="step-line"></div>
          <StepIndicator step={2} label="Contact" isActive={currentStep === 2} isCompleted={currentStep > 2} /> <div className="step-line"></div>
          <StepIndicator step={3} label="Identity" isActive={currentStep === 3} isCompleted={false} />
        </div>
      </div>
      
      <div className="wizard-content">
        {currentStep === 1 && (
          <div className="form-step">
            <h3><User size={24} /> Personal Information</h3>
            <div className="form-grid">
              <FormInput label="Full Name" {...register('fullName')} icon={User} required error={errors.fullName} />
              <FormInput label="Username" {...register('username')} icon={Hash} required error={errors.username} />
              <FormInput label="Date of Birth" type="date" {...register('dateOfBirth')} icon={Calendar} error={errors.dateOfBirth} />
              <div className="form-group">
                <label><Users size={16} /><span>Gender</span></label>
                <select {...register('gender')}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <FormInput label="Nationality" {...register('nationality')} icon={Flag} error={errors.nationality} />
              <FormInput label="Profile Photo" type="file" {...register('profilePhoto')} icon={LinkIcon} error={errors.profilePhoto} accept="image/jpeg, image/jpg" />
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="form-step">
            <h3><Mail size={24} /> Contact Information</h3>
            <div className="form-grid">
              <FormInput label="Email Address" type="email" {...register('email')} icon={Mail} error={errors.email} />
              <FormInput label="Phone Number" {...register('phoneNumber')} icon={Hash} error={errors.phoneNumber} />
              <div className="form-group full-width">
                <FormInput label="Residential Address" type="textarea" {...register('residentialAddress')} icon={Building} rows={4} error={errors.residentialAddress} />
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="form-step">
            <h3><FileText size={24} /> Government & Identity Documents</h3>
            <div className="form-grid">
              <div className="form-group">
                <label><FileText size={16} /><span>National ID Type</span></label>
                <select {...register('nationalIdType')}>
                  <option>Aadhaar</option>
                  <option>Passport</option>
                  <option>Driver's License</option>
                </select>
              </div>
              <FormInput label="National ID Number" {...register('nationalIdNumber')} icon={Hash} error={errors.nationalIdNumber} />
              <div className="form-group full-width">
                <FormInput label="Document File" type="file" {...register('documentFile')} icon={FileText} error={errors.documentFile} accept="application/pdf" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-actions">
        <button type="button" onClick={handlePrevStep} disabled={currentStep === 1} className="btn-secondary"><ArrowLeft size={20} /><span>Previous</span></button>
        {currentStep < 3
          ? <button type="button" onClick={handleNextStep} className="btn-primary"><span>Next</span><ArrowRight size={20} /></button>
          : <button type="button" onClick={triggerSubmit} disabled={loading} className="btn-primary">
              {loading ? <Loader size={20} className="spinner" /> : <Save size={20} />}
              <span>Save Identity</span>
            </button>
        }
        {!isNewProfile && <button type="button" onClick={onCancel} className="btn-text">Cancel</button>}
      </div>
    </form>
  );
}