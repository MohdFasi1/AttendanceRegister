import React, { useState } from 'react'
import { useForm, } from "react-hook-form"
import Cookies from 'js-cookie'
import { Typography } from '@material-tailwind/react'
import { Link, useNavigate } from 'react-router-dom'
import login from '../../assets/Login.png'

const LoginPage = ({ setLoginData }) => {
    const [Status, setStatus] = useState('');
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const onSubmit = async (data) => {
        try {
            const a = await fetch(`${import.meta.env.VITE__API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email.toLowerCase(), password: data.password }),
                credentials: 'include',
            });
            const res = await a.json();
            if (res.data) {
                Cookies.set('cred', JSON.stringify(res.data), { expires: 7 })
            }
            setLoginData(res.data);
            setStatus(res.message)
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <div className='lg:flex  h-screen p-2 '>
            <div className='lg:w-1/2 w-full lg:block flex justify-center items-center bg-primary rounded-xl lg:h-full h-1/2'>
                <div className='lg:flex hidden flex-col justify-center items-center h-1/2 gap-4'>
                    <h1 className='text-3xl text-secondary font-semibold font-poppins text-balance text-center'>Attendance Register</h1>
                    <p className='text-t1 font-light text-xs font-poppins text-balance text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel inventore consequuntur laborum a ullam omnis ipsa repellendus ea facilis error quaerat rerum optio beatae, numquam dolore blanditiis cumque enim nemo.</p>
                </div>
                <img src={login} alt="" className='w-full lg:h-1/2 h-full object-contain object-center ' />
            </div>
            <div className='lg:w-1/2 flex flex-col items-center justify-center md:p-24 p-12 gap-8'>
                <h1 className='text-3xl text-secondary font-semibold font-poppins'>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className='lg:w-full md:w-1/2 w-full'>
                    <div className='w-full flex flex-col gap-8'>
                        {/* Email Field */}
                        <p className='text-sm text-red-500 leading-none text-center'>{Status}</p>
                        <div>
                            <Typography color='gray' className='font-poppins text-sm'>Email</Typography>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex pt-2 pl-3">
                                    {/* Email Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
                                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    onChange={() => setStatus("")}
                                    autoComplete="off"
                                    className="w-full pl-12 rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                />
                                {errors.email && <span className="text-red-500">Email is required</span>}
                            </div>
                        </div>

                        <div>
                            <Typography color='gray' className='font-poppins text-sm'>Password</Typography>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex pt-2 pl-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-400">
                                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password" // Ensure type is password
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'Password should be at least 8 characters' },
                                    })}
                                    onChange={() => setStatus("")}
                                    autoComplete="off"
                                    className="w-full pl-12 rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                />
                                {
                                    errors.password && <p role='alert' className='text-xs text-red-400 leading-none'>{errors.password.message}</p>
                                }
                                <div className='absolute w-full flex flex-end'>
                                    <Link to='/reset' className="text-secondary text-xs text-right font-extralight w-full">Forgot password?</Link>
                                </div>
                            </div>
                        </div>

                        <button className='bg-tertary p-2 text-white' type='submit'>Login</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default LoginPage