import React from 'react'

const Cloumn = ({ cloumn, task }) => {
    return (
        <div style={{ width: "300px", display: "flex", flexDirection: "column", borderRadius: "8px", backgroundColor: cloumn.bgColor }}>
            <h3>{cloumn.name}</h3>
            <div style={{ padding: "8px" ,display:"flex",flexDirection:"column",gap:"8px"}}>
                {task.map((item) => (
                    <div key={item.id}>{item.content}</div>
                ))}
            </div>
        </div>
    )
}

export default Cloumn