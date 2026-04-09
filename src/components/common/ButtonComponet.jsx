import React from 'react'
import "./Button.css"

const ButtonComponent = ({ text, action }) => {
    return (
        <button onClick={action} className='accentBtn'  >
            {text}
        </button>
    )
}

export const SecondaryButton = ({ text, handleChange }) => {
    return <button onClick={handleChange} className='secondaryBtn'>
        {text}
    </button>
}

export const DeleteButton = ({ text, handleChange }) => {
    return <button onClick={handleChange} className='deleBtn'>
        {text}
    </button>
}

export default ButtonComponent