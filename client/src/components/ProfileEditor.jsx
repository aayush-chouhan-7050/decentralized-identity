// src/components/ProfileEditor.jsx
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schemas/profileSchema';
import { useDebounce } from '../hooks/useDebounce';
import { FormField } from './ui/FormField'; // NEW: Using the unified FormField
import { StepIndicator } from './ui/StepIndicator';

import { User, Mail, Globe, Briefcase, Code, Hash, Link as LinkIcon, Building, ArrowRight, ArrowLeft, Loader, Save, X, Twitter, Github, Linkedin, GraduationCap, FileText, Calendar, Users, Flag } from 'lucide-react';

const getInitialValues = (existingProfile) => {
  const defaultValues = {
    firstName: "", middleName: "", lastName: "", username: "",
    dateOfBirth: undefined, gender: "Male", nationality: "",
    profilePhoto: null, email: "", phoneNumber: "", residentialAddress: "",
    nationalIdType: "", nationalIdNumber: "", documentFile: null,
    jobTitle: "", organization: "", workExperience: "", skills: "",
    resume: null, portfolio: "", highestQualification: "", institutionName: "",
    graduationYear: "", certifications: "", linkedin: "", github: "",
    twitter: "", blog: "",
  };

  let initialData = { ...defaultValues };

  if (existingProfile) {
    initialData = { ...initialData, ...existingProfile };
    if (existingProfile.dateOfBirth) {
      initialData.dateOfBirth = new Date(existingProfile.dateOfBirth);
    }
  } else {
    const savedDraft = localStorage.getItem('profileDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        initialData = { ...initialData, ...draft, dateOfBirth: draft.dateOfBirth ? new Date(draft.dateOfBirth) : undefined };
      } catch (e) { /* Ignore parsing errors */ }
    }
  }
  return initialData;
};

export default function ProfileEditor({ existingProfile, onSubmit, onCancel, loading, isNewProfile }) {
  const [currentStep, setCurrentStep] = useState(1);

  const { register, control, watch, trigger, getValues, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: getInitialValues(existingProfile),
    mode: 'onChange',
  });

  const nationalIdType = watch('nationalIdType');
  const watchedData = watch();
  const debouncedData = useDebounce(watchedData, 500);

  useEffect(() => {
    if (!isNewProfile) {
      reset(getInitialValues(existingProfile));
    }
  }, [existingProfile, reset, isNewProfile]);

  useEffect(() => {
    if (isNewProfile) {
      localStorage.setItem('profileDraft', JSON.stringify(debouncedData));
    }
  }, [debouncedData, isNewProfile]);

  const handleFinalSubmit = (data) => {
    onSubmit(data); 
    if (isNewProfile) {
      localStorage.removeItem('profileDraft');
    }
  };

  const triggerSubmit = async () => {
    const isFormValid = await trigger();
    if (isFormValid) {
      handleFinalSubmit(getValues());
    }
  };
  
  const handleNextStep = async () => {
    const fieldsByStep = {
      1: ['firstName', 'lastName', 'username'],
      2: ['email'],
      3: ['portfolio'],
      4: [],
      5: ['linkedin', 'github', 'twitter', 'blog'],
      6: ['nationalIdNumber']
    };
    const isValidStep = await trigger(fieldsByStep[currentStep]);
    if (isValidStep) {
      setCurrentStep(prev => prev < 6 ? prev + 1 : prev);
    }
  };

  const handlePrevStep = () => setCurrentStep(prev => prev > 1 ? prev - 1 : prev);

  return (
    <form className="form-wizard" noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="wizard-header">
        <h2>{isNewProfile ? 'Create Your Identity' : 'Update Your Identity'}</h2>
        <p>Your digital identity is secure, private, and controlled entirely by you.</p>
        <div className="step-indicators">
          <StepIndicator step={1} label="Personal" isActive={currentStep === 1} isCompleted={currentStep > 1} /> <div className="step-line"></div>
          <StepIndicator step={2} label="Contact" isActive={currentStep === 2} isCompleted={currentStep > 2} /> <div className="step-line"></div>
          <StepIndicator step={3} label="Professional" isActive={currentStep === 3} isCompleted={currentStep > 3} /> <div className="step-line"></div>
          <StepIndicator step={4} label="Education" isActive={currentStep === 4} isCompleted={currentStep > 4} /> <div className="step-line"></div>
          <StepIndicator step={5} label="Social" isActive={currentStep === 5} isCompleted={currentStep > 5} /> <div className="step-line"></div>
          <StepIndicator step={6} label="Identity" isActive={currentStep === 6} />
        </div>
      </div>
      
      <div className="wizard-content">
        {currentStep === 1 && (
            <div className="form-step">
                <h3><User size={24} /> Personal Information</h3>
                <div className="form-grid">
                    <FormField label="First Name" name="firstName" register={register} icon={User} required error={errors.firstName} />
                    <FormField label="Middle Name" name="middleName" register={register} icon={User} error={errors.middleName} />
                    <FormField label="Last Name" name="lastName" register={register} icon={User} required error={errors.lastName} />
                    <FormField label="Username" name="username" register={register} icon={Hash} required error={errors.username} />
                    <Controller name="dateOfBirth" control={control} render={({ field }) => (
                        <FormField label="Date of Birth" type="date" icon={Calendar} error={errors.dateOfBirth}
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        />
                    )}/>
                    <FormField label="Gender" name="gender" type="select" register={register} icon={Users} options={["Male", "Female", "Other"]} />
                    <FormField label="Nationality" name="nationality" register={register} icon={Flag} error={errors.nationality} />
                    <FormField label="Profile Photo" name="profilePhoto" type="file" control={control} icon={User} error={errors.profilePhoto} accept="image/jpeg, image/jpg" />
                </div>
            </div>
        )}
        {currentStep === 2 && (
          <div className="form-step">
            <h3><Mail size={24} /> Contact Information</h3>
            <div className="form-grid">
              <FormField label="Email Address" type="email" name="email" register={register} icon={Mail} error={errors.email} />
              <FormField label="Phone Number" name="phoneNumber" register={register} icon={Hash} error={errors.phoneNumber} />
              <div className="form-group full-width">
                <FormField label="Residential Address" type="textarea" name="residentialAddress" register={register} icon={Building} rows={4} error={errors.residentialAddress} />
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="form-step">
            <h3><Briefcase size={24} /> Professional Information</h3>
            <div className="form-grid">
              <FormField label="Current Job Title" name="jobTitle" register={register} icon={Briefcase} error={errors.jobTitle} />
              <FormField label="Organization / Company" name="organization" register={register} icon={Building} error={errors.organization} />
              <FormField label="Work Experience (Years)" type="number" name="workExperience" register={register} icon={Calendar} error={errors.workExperience} />
              <FormField label="Skills" name="skills" register={register} icon={Code} error={errors.skills} placeholder="e.g., JavaScript, React, Node.js" />
              <FormField label="Résumé / CV (PDF)" type="file" name="resume" control={control} icon={FileText} error={errors.resume} accept="application/pdf" />
              <FormField label="Portfolio URL" type="url" name="portfolio" register={register} icon={LinkIcon} error={errors.portfolio} placeholder="https://example.com" />
            </div>
          </div>
        )}
        {currentStep === 4 && (
            <div className="form-step">
                <h3><GraduationCap size={24} /> Educational Information</h3>
                <div className="form-grid">
                    <FormField label="Highest Qualification" name="highestQualification" register={register} icon={GraduationCap} error={errors.highestQualification} />
                    <FormField label="Institution Name" name="institutionName" register={register} icon={Building} error={errors.institutionName} />
                    <FormField label="Graduation Year" type="number" name="graduationYear" register={register} icon={Calendar} error={errors.graduationYear} />
                    <FormField label="Certifications" type="textarea" name="certifications" register={register} icon={FileText} error={errors.certifications} placeholder="e.g., Certified Kubernetes Administrator" />
                </div>
            </div>
        )}
        {currentStep === 5 && (
            <div className="form-step">
                <h3><Globe size={24} /> Social / Online Presence</h3>
                <div className="form-grid">
                    <FormField label="LinkedIn Profile" type="url" name="linkedin" register={register} icon={Linkedin} error={errors.linkedin} placeholder="https://linkedin.com/in/username" />
                    <FormField label="GitHub Profile" type="url" name="github" register={register} icon={Github} error={errors.github} placeholder="https://github.com/username" />
                    <FormField label="Twitter / X Profile" type="url" name="twitter" register={register} icon={Twitter} error={errors.twitter} placeholder="https://twitter.com/username" />
                    <FormField label="Blog / Medium URL" type="url" name="blog" register={register} icon={LinkIcon} error={errors.blog} placeholder="https://medium.com/@username" />
                </div>
            </div>
        )}
        {currentStep === 6 && (
            <div className="form-step">
                <h3><FileText size={24} /> Government & Identity Documents</h3>
                <div className="form-grid">
                    <FormField label="National ID Type" name="nationalIdType" type="select" register={register} icon={FileText} options={["", "Aadhaar", "Passport", "Driver's License", "Other"]} />
                    <FormField label="National ID Number" name="nationalIdNumber" register={register} icon={Hash} error={errors.nationalIdNumber} required={!!nationalIdType} />
                    <div className="form-group full-width">
                      <FormField label="Document File (PDF)" type="file" name="documentFile" control={control} icon={FileText} error={errors.documentFile} accept="application/pdf" />
                    </div>
                </div>
            </div>
        )}
      </div>

      <div className="wizard-actions">
        <div style={{ display: 'flex', gap: '1rem' }} >
          <button type="button" onClick={handlePrevStep} disabled={currentStep === 1 || loading} className="btn-secondary"><ArrowLeft size={20} /><span>Previous</span></button>
          <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary btn-cancel"><X size={20} /><span>Cancel</span></button>
        </div>
        {currentStep < 6
          ? <button type="button" onClick={handleNextStep} className="btn-primary"><span>Next</span><ArrowRight size={20} /></button>
          : <button type="button" onClick={triggerSubmit} disabled={loading} className="btn-primary">
              {loading ? <Loader size={20} className="spinner" /> : <Save size={20} />}
              <span>{isNewProfile ? 'Create & Save Identity' : 'Update & Save Identity'}</span>
            </button>
        }
      </div>
    </form>
  );
}