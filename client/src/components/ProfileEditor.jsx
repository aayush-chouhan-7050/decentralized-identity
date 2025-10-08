// src/components/ProfileEditor.jsx
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schemas/profileSchema';
import { useDebounce } from '../hooks/useDebounce';
import { FormInput } from './ui/FormInput';
import { StepIndicator } from './ui/StepIndicator';

import { User, Mail, Globe, Briefcase, Code, Hash, Link as LinkIcon, Building, ArrowRight, ArrowLeft, Loader, Save, Twitter, Github, Linkedin } from 'lucide-react';

const getInitialValues = (existingProfile) => {
  const savedDraft = localStorage.getItem('profileDraft');
  const defaultValues = {
    name: "", username: "", email: "", bio: "", profileImage: "",
    occupation: "", organization: "", website: "", skills: [],
    socialLinks: { github: "", linkedin: "", twitter: "" },
  };
  if (savedDraft) {
    try {
        return JSON.parse(savedDraft);
    } catch (e) {
        return existingProfile ? { ...defaultValues, ...existingProfile } : defaultValues;
    }
  }
  return existingProfile ? { ...defaultValues, ...existingProfile } : defaultValues;
};

export default function ProfileEditor({ existingProfile, onSubmit, onCancel, loading, isNewProfile }) {
  const [currentStep, setCurrentStep] = useState(1);

  // **NEW: Added getValues to useForm hook**
  const { register, control, watch, trigger, getValues, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: getInitialValues(existingProfile),
    mode: 'onChange',
  });

  // Debounce and save form to localStorage
  const watchedData = watch();
  const debouncedData = useDebounce(watchedData, 500);

  useEffect(() => {
    localStorage.setItem('profileDraft', JSON.stringify(debouncedData));
  }, [debouncedData]);

  const handleFinalSubmit = (data) => {
    if (typeof data.skills === 'string') {
        data.skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    onSubmit(data);
    localStorage.removeItem('profileDraft');
  };

  // **NEW: Manually trigger submission after validation**
  const triggerSubmit = async () => {
    const isFormValid = await trigger(); // Validate all fields
    if (isFormValid) {
      handleFinalSubmit(getValues()); // Get values and submit
    }
  };
  
  const handleNextStep = async () => {
    const fieldsToValidate = {
      1: ['name', 'username', 'email', 'profileImage', 'bio'],
      2: ['occupation', 'organization', 'website', 'skills'],
    }[currentStep];

    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  // **FIX: Removed onSubmit from form tag**
  return (
    <form className="form-wizard" noValidate>
      <div className="wizard-header">
        <h2>{isNewProfile ? 'Create Your Identity' : 'Update Your Identity'}</h2>
        <p>Your digital identity is secure and controlled by you.</p>
        <div className="step-indicators">
          <StepIndicator step={1} label="Basic" isActive={currentStep === 1} isCompleted={currentStep > 1} /> <div className="step-line"></div>
          <StepIndicator step={2} label="Professional" isActive={currentStep === 2} isCompleted={currentStep > 2} /> <div className="step-line"></div>
          <StepIndicator step={3} label="Social" isActive={currentStep === 3} isCompleted={false} />
        </div>
      </div>
      
      <div className="wizard-content">
        {/* Step content remains the same... */}
        {currentStep === 1 && (
          <div className="form-step">
            <h3><User size={24} /> Basic Information</h3>
            <div className="form-grid">
              <FormInput label="Full Name" {...register('name')} icon={User} required error={errors.name} />
              <FormInput label="Username" {...register('username')} icon={Hash} error={errors.username} />
              <FormInput label="Email" type="email" {...register('email')} icon={Mail} error={errors.email} />
              <FormInput label="Profile Image URL" {...register('profileImage')} icon={LinkIcon} error={errors.profileImage} />
              <div className="form-group full-width">
                <FormInput label="Bio" type="textarea" {...register('bio')} icon={User} rows={4} error={errors.bio} />
              </div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="form-step">
            <h3><Briefcase size={24} /> Professional & Skills</h3>
            <div className="form-grid">
              <FormInput label="Occupation" {...register('occupation')} icon={Briefcase} error={errors.occupation} />
              <FormInput label="Organization" {...register('organization')} icon={Building} error={errors.organization} />
              <FormInput label="Website" {...register('website')} icon={Globe} error={errors.website} />
              <div className="form-group full-width">
                 <Controller
                    name="skills"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <FormInput
                            label="Skills (comma-separated)"
                            value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                            onChange={(e) => field.onChange(e.target.value.split(',').map(skill => skill.trim()))}
                            icon={Code}
                            error={errors.skills}
                        />
                    )}
                />
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="form-step">
            <h3><Globe size={24} /> Social Links</h3>
            <div className="form-grid">
              <FormInput label="GitHub" {...register('socialLinks.github')} icon={Github} error={errors.socialLinks?.github} />
              <FormInput label="LinkedIn" {...register('socialLinks.linkedin')} icon={Linkedin} error={errors.socialLinks?.linkedin} />
              <FormInput label="Twitter" {...register('socialLinks.twitter')} icon={Twitter} error={errors.socialLinks?.twitter} />
            </div>
          </div>
        )}
      </div>

      <div className="wizard-actions">
        <button type="button" onClick={handlePrevStep} disabled={currentStep === 1} className="btn-secondary"><ArrowLeft size={20} /><span>Previous</span></button>
        {currentStep < 3 
          ? <button type="button" onClick={handleNextStep} className="btn-primary"><span>Next</span><ArrowRight size={20} /></button> 
          // **FIX: Changed submit button to use the manual trigger**
          : <button type="button" onClick={triggerSubmit} disabled={loading || !isValid} className="btn-primary">
              {loading ? <Loader size={20} className="spinner" /> : <Save size={20} />}
              <span>Save Identity</span>
            </button>
        }
        {!isNewProfile && <button type="button" onClick={onCancel} className="btn-text">Cancel</button>}
      </div>
    </form>
  );
}