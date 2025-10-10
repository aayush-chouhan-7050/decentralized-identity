// src/components/ui/FormField.jsx
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

const FileInput = ({ control, name, accept, error }) => {
  const [fileName, setFileName] = useState('');
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => {
        const handleFileChange = (e) => {
          if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
            onChange(e.target.files);
          } else {
            setFileName('');
            onChange(null);
          }
        };

        const currentFileName = typeof value === 'string' ? value.split('/').pop() : fileName;

        return (
          <div className={`file-input-wrapper ${error ? 'has-error' : ''}`}>
            <label htmlFor={name} className="file-input-label">
              <UploadCloud size={20} />
              <span>{currentFileName || 'Click to upload a file'}</span>
            </label>
            <input
              id={name}
              type="file"
              ref={ref}
              onChange={handleFileChange}
              accept={accept}
              style={{ display: 'none' }}
            />
            {currentFileName && (
              <button type="button" className="file-input-clear" onClick={() => { setFileName(''); onChange(null); }}>
                <X size={16} />
              </button>
            )}
          </div>
        );
      }}
    />
  );
};

export const FormField = ({ label, name, type = "text", placeholder, icon: Icon, required = false, rows = 3, error, register, control, options, ...props }) => {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return <textarea name={name} placeholder={placeholder} rows={rows} {...(register ? register(name) : {})} {...props} />;
      case 'select':
        return (
          <select name={name} {...(register ? register(name) : {})} {...props}>
            {options.map((opt, index) => (
              <option key={index} value={opt === "" ? "" : opt}>{opt === "" ? "Select a type..." : opt}</option>
            ))}
          </select>
        );
      case 'file':
        return <FileInput name={name} control={control} error={error} {...props} />;
      default:
        return <input type={type} name={name} placeholder={placeholder} {...(register ? register(name) : {})} {...props} />;
    }
  };

  return (
    <div className={`form-group ${type === 'file' ? 'file-group' : ''}`}>
      {label && (
        <label htmlFor={name}>
          {Icon && <Icon size={16} />}
          <span>{label} {required && <span className="required">*</span>}</span>
        </label>
      )}
      {renderInput()}
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
};