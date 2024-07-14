import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const ProfileForm = ({ onSubmit }) => {


  const [formData, setFormData] = useState({
    petPicture: '',
    petName: '',
    gender: '',
    birthday: '',
    species: '',
    breed: '',
    spayed: '',
    allergies: '',
    healthConditions: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData)
  };

  const fields = [
    {
      name: 'petPicture',
      label: 'Picture',
      type: 'file',
      placeholder: 'Upload picture',
    },
    {
      name: 'petName',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter pet name',
      required: true,
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      placeholder: 'Select gender',
      required: true,
      options: [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'birthday',
      label: 'Birthday',
      type: 'date',
      placeholder: 'Enter pet birthday',
      required: true,
    },
    {
      name: 'species',
      label: 'Species',
      type: 'select',
      placeholder: 'Select species',
      required: true,
      options: [
        { label: 'Dog', value: 'Dog' },
        { label: 'Cat', value: 'Cat' },
        { label: 'Bird', value: 'Bird' },
        { label: 'Reptile', value: 'Reptile' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'breed',
      label: 'Breed',
      type: 'text',
      placeholder: 'Enter pet breed',
      required: true,
    },
    {
      name: 'spayed',
      label: 'Spayed or Neutered?',
      type: 'select',
      placeholder: 'Pet\'s Spay/Neuter Status',
      required: true,
      options: [
        { label: 'Yes', value: 'True' },
        { label: 'No', value: 'False' },
      ],
    },
    {
      name: 'allergies',
      label: 'Allergies (if any)',
      type: 'textarea',
      placeholder: 'Enter pet allergies',
      required: false,
    },
    {
      name: 'healthConditions',
      label: 'Health Conditions (if any)',
      type: 'textarea',
      placeholder: 'Enter pet health conditions',
      required: false,
    },
  ];

  return (
    <Form onSubmit={handleSubmit}>
    <Card className="mb-3">
      <Card.Body>
        {fields.map((field, index) => (
          <Form.Group key={index} controlId={field.name}>
            <Form.Label className='mt-2'>{field.label}</Form.Label>
            {field.type === 'textarea' ? (
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={field.placeholder}
                name={field.name}
                onChange={handleInputChange}
                required={field.required}
              />
            ) : (
              <>
                {field.type === 'select' ? (
                  <Form.Control
                    as="select"
                    name={field.name}
                    onChange={handleInputChange}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                ) : (
                  <Form.Control
                    type={field.type}
                    placeholder={field.placeholder}
                    name={field.name}
                    onChange={handleInputChange}
                    required={field.required}
                  />
                )}
              </>
            )}
          </Form.Group>
        ))}
      </Card.Body>
    </Card>
    <div className="d-flex justify-content-center">
    <Button variant="primary"  className= "mx-2" type="submit">
      Register
    </Button>

    
    </div>
  </Form>
);
};

export default ProfileForm;