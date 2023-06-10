import React from 'react';
import './Error.css';
import errorImage from '../../image/error.png';

const Error = (props) => {
  return (
    <div className='error-message'>
      <img src={errorImage} alt="error" width={'50rem'} />
      {props.message}
    </div>
  )
}

export default Error
