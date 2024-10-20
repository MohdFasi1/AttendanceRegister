import { Button, Card, CardBody } from '@material-tailwind/react'
import React from 'react'

const DataCard = ({ title, progress, max,children }) => {

    const radius = 44; // Radius of the outer circle
    const circumference = 2 * Math.PI * radius; // Circumference of the circle
    const validMax = max > 0 ? max : 1;
    const offset = circumference - (progress / validMax) * circumference;

    return (
        <div className='flex h-40 bg-white p-4 w-full '>
            <div className='h-full flex- flex-col justify-center items-center w-full' >
                <h1 className='font-poppins text-lg text-tertary'>{title}</h1>
                <div className='flex w-full'>
                    <div className="flex justify-center items-center pt-5 ">
                        {/* Outer Progress Circle */}
                        <svg width="100" height="100" className="absolute z-30" transform='rotate(270,0,0)'>
                            <circle
                                stroke="#7e7e7e" // Background circle color (gray)
                                strokeWidth="8"
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                            />
                            <circle
                                // stroke="#f59e0b"// Progress color (orange)
                                strokeWidth="8"
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                className="transition stroke-current duration-300 text-tertary"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className='w-full h-full flex justify-center items-center rounded-full p-4 bg-white'>
                            <h1 className='w-full f-full text-3xl flex justify-center items-attendance text-secondary'>{progress}/{max}</h1>
                        </div>

                    </div>
                    {children}
                </div>

            </div>
        </div>
    )
}

export default DataCard