import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

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
    health_conditions: '',
  });

  const [breedOptions, setBreedOptions] = useState([]);

  const speciesOptions = [
    { label: 'Dog', value: 'Dog' },
    { label: 'Cat', value: 'Cat' },
    { label: 'Bird', value: 'Bird' },
    { label: 'Reptile', value: 'Reptile' },
    { label: 'Other', value: 'Other' },
  ];

  useEffect(() => {

    setBreedOptions([]);
  }, [formData.species]);

  const fetchBreeds = async (selectedSpecies) => {
    try {
      let response;
      if (selectedSpecies === 'Dog') {
        response = await axios.get('https://api.thedogapi.com/v1/breeds');
      } else if (selectedSpecies === 'Cat') {
        response = await axios.get('https://api.thecatapi.com/v1/breeds');
      } else {
        setBreedOptions([]);
        return;
      }

      if (response.status === 200) {
        const breeds = response.data.map((breed) => ({
          label: breed.name,
          value: breed.name,
        }));
        setBreedOptions(breeds);
      } else {
        console.log(`Error fetching ${selectedSpecies.toLowerCase()} breeds`);
        setBreedOptions([]);
      }
    } catch (error) {
      console.error('Error fetching breeds', error);
      setBreedOptions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name !== 'breed') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (name === "species") {
      setFormData(prevFormData => ({
        ...prevFormData,
        breed: '', 
      }));
      
      if (value === "Dog" || value === "Cat") {
        fetchBreeds(value);
      } else {
        setBreedOptions([]);
      }
    }

    if (name === "breed") {
      setFormData(prev => ({
        ...prev,
        breed: value,
      }));
    }
  };

  const fields = [
    {
      name: 'petPicture',
      label: 'Picture',
      type: 'file',
      placeholder: 'Upload picture',
    },
    {
      name: 'pet_name',
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
      options: speciesOptions,
    },
    {
      name: 'breed',
      label: 'Breed',
      type: formData.species === "Dog" || formData.species === "Cat" ? "select" : "text",
      placeholder: formData.species === "Dog" || formData.species === "Cat" ? 'Select breed' : 'Enter pet breed',
      required: true,
      options: breedOptions,
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
      name: 'health_conditions',
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
                  value={formData[field.name]}
                  required={field.required}
                />
              ) : (
                <>
                  {field.type === 'select' ? (
                    <Form.Control
                      as="select"
                      name={field.name}
                      onChange={handleInputChange}
                      value={formData[field.name]}
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
                      value={formData[field.name]}
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
        <Button variant="primary" className="mx-2" type="submit">
          Register
        </Button>
      </div>
    </Form>
  );
};

export default ProfileForm;
