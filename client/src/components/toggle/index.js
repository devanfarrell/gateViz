import React from 'react'
import ReactToggle from 'react-toggle'

const Toggle = props => {
    return (
        <>
            <ReactToggle
                id={props.id.toString()}
                defaultChecked={props.checked}
                onChange={() => props.handleToggle(props.id)}
                icons={{
                    checked: <div style={{color: "rgb(255, 255, 255)", fontSize: "1.2em", position: "absolute", top: "0.2em"}}>1</div>,
                    unchecked: <div style={{color: "rgb(255, 255, 255)", fontSize: "1.2em", position: "absolute", top: "0.2em"}}>0</div>,
                  }}
            />
            <label className="toggleText" htmlFor={props.id.toString()}>{props.label}</label>
        </>
    )
};

export default Toggle;