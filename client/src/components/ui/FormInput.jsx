// src/components/ui/FormInput.jsx
import React from 'react';

export const FormInput = React.forwardRef(({ label, name, type = "text", placeholder, icon: Icon, required = false, rows = 3, error, ...props }, ref) => (
  <div className="form-group">
    <label>
      {Icon && <Icon size={16} />}
      <span>{label} {required && <span className="required">*</span>}</span>
    </label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        ref={ref}
        {...props}
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    )}
    {error && <p className="error-message">{error.message}</p>}
  </div>
));