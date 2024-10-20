import { Alert, Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const EmployeeForm = ({open,handleOpen, loginData, method,message, setMessage, data}) => {
    const [ismismatch, setIsmismatch] = useState(false);
    const [Status, setStatus] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm()

    const handleSetValues = () => {
        setValue('fname', data?.name && data.name.split(' ')[0]);
        setValue('mname', data?.name ? data.name.split(' ').length > 2 ? data.name.split(' ')[1]: "" : "");
        setValue('lname', data?.name && data.name.split(' ')[data.name.split(' ').length-1]);
        setValue('email', data?.email && data.email);
        setValue('position', data?.position && data.position);
        setValue('department', data?.department && data.department);
        setValue('joinDate', data?.joinDate && data.joinDate);
        setValue('salary', data?.salary && data.salary);
        setValue('phone', data?.phone && data.phone);
        setValue('address', data?.address && data.address);
      };
        handleSetValues();
      

    const onSubmit = async (vals) => {
        try {
            if (vals.password === vals.repassword) {
                let { fname, mname, lname, email, phone, password, position, department, joinDate, salary, address } = { ...vals }
                let emp = {
                    name: fname + " " + (mname && mname + " ") + lname,
                    email,
                    phone,
                    position,
                    department,
                    joinDate,
                    salary,
                    address,
                    isAdmin
                }
                let api = await fetch(`${process.env.REACT_APP_API_URL}/api/employee-details`, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: method == "POST" ? JSON.stringify({...emp,password}) : JSON.stringify({_id:data._id,...emp})
                })
                let res = await api.json();
                setMessage(res);
                reset();
                handleOpen();
                setTimeout(() => {
                    setMessage({})
                }, 5000);
            } else {
                setIsmismatch(true)
            }
        } catch (err) {
            console.error(err)
        }
        console.log({

        })
    }
    
  return (<>
    <Dialog open={open} handler={handleOpen} size='xxl' >
                    <DialogHeader className='text-tertary'>Add Employee</DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-between w-full h-full'>
                        <DialogBody>
                            <div className='w-full flex flex-col gap-8'>
                                <p className='text-sm text-red-500 leading-none text-center'>{Status}</p>

                                {/* first line  */}
                                <div className='flex justify-between gap-2'>
                                    <div className='w-full'>
                                        <Typography color='gray' className='font-poppins text-sm'>First Name</Typography>
                                        <input
                                            type="text"
                                            {...register("fname", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.fname && <span className="text-red-500">First Name is required</span>}

                                    </div>
                                    <div className='w-full'>
                                        <Typography color='gray' className='font-poppins text-sm'>Middle Name</Typography>
                                        <input
                                            type="text"
                                            {...register("mname")}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Typography color='gray' className='font-poppins text-sm'>Last Name</Typography>
                                        <input
                                            type="text"
                                            {...register("lname", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.lname && <span className="text-red-500">Last Name is required</span>}
                                    </div>
                                </div>

                                {/* second line  */}
                                <div className='grid grid-cols-3 justify-between gap-2'>
                                    <div className='w-full'>
                                        <Typography color='gray' className='font-poppins text-sm'>Email</Typography>
                                        <input
                                            type="email"
                                            {...register("email", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.email && <span className="text-red-500">Email is required</span>}
                                    </div>
                                    {method == "POST" &&<>
                                    <div className='w-full'>
                                        <Typography color='gray' className='font-poppins text-sm'>Password</Typography>
                                        <input
                                            type="password" // Ensure type is password
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: { value: 8, message: 'Password should be at least 8 characters' },
                                            })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {
                                            errors.password && <p role='alert' className='text-xs text-red-400 leading-none'>{errors.password.message}</p>
                                        }
                                    </div>
                                    <div className='w-full'>
                                        <Typography color='gray' className='font-poppins text-sm'>Re-enter Password</Typography>

                                        <input
                                            type="password" // Ensure type is password
                                            {...register('repassword', {
                                                required: 'Password is required',
                                                minLength: { value: 8, message: 'Password should be at least 8 characters' },
                                            })}
                                            onChange={() => { setStatus(""); setIsmismatch(false) }}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {
                                            errors.password && <p role='alert' className='text-xs text-red-400 leading-none'>{errors.password.message}</p>
                                        }
                                        {
                                            ismismatch && <p role='alert' className='text-xs text-red-400 leading-none'>Password doesn't match</p>
                                        }
                                    </div></>}
                                </div>

                                <div className='grid grid-cols-3  justify-between gap-2'>
                                    <div>
                                        <Typography color='gray' className='font-poppins text-sm'>Position/Roll</Typography>
                                        <input
                                            type="text"
                                            {...register("position", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.position && <span className="text-red-500">Position is required</span>}
                                    </div>
                                    <div>
                                        <Typography color='gray' className='font-poppins text-sm'>Department</Typography>
                                        <input
                                            type="text"
                                            {...register("department", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.department && <span className="text-red-500">Department is required</span>}
                                    </div>
                                    <div>
                                        <Typography color='gray' className='font-poppins text-sm'>Joining Date</Typography>
                                        <input
                                            type="date"
                                            {...register("joinDate", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.joinDate && <span className="text-red-500">Joining Date is required</span>}
                                    </div>
                                    <div>
                                        <Typography color='gray' className='font-poppins text-sm'>Salary</Typography>
                                        <input
                                            type="number"
                                            {...register("salary", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.salary && <span className="text-red-500">Salary is required</span>}
                                    </div>
                                </div>

                                <div className='grid grid-cols-3  justify-between gap-2'>
                                    <div>
                                        <Typography color='gray' className='font-poppins text-sm'>Phone Number</Typography>
                                        <input
                                            type="number"
                                            {...register("phone", {
                                                required: "Phone Number is required",
                                                maxLength: { value: 10, message: 'Number should have 10 digits' },
                                                minLength: { value: 10, message: 'Number should have 10 digits' },
                                            })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.phone && <span className="text-red-500">{errors.phone.message.message}</span>}
                                    </div>
                                    <div>
                                        <Typography color='gray' className='font-poppins text-sm'>Address</Typography>
                                        <input
                                            type="text"
                                            {...register("address", { required: true })}
                                            onChange={() => setStatus("")}
                                            autoComplete="off"
                                            className="w-full rounded-none font-poppins text-t1 text-sm border-t1 border p-2"
                                        />
                                        {errors.address && <span className="text-red-500">Address is required</span>}
                                    </div>
                                    <div className='flex items-center pt-4'>
                                        {
                                            loginData?.superUser && <Checkbox label="is Admin" value={isAdmin} onChange={() => setIsAdmin(true)} className='checked:bg-tertary' />
                                        }
                                    </div>
                                </div>
                            </div>
                        </DialogBody>
                        <DialogFooter className='flex gap-2'>
                            <Button variant='text' color='red' onClick={() => { handleOpen(); reset() }}>Cancle</Button>
                            <Button className='bg-tertary text-white' type='submit'>Submit</Button>
                        </DialogFooter>
                    </form>


                </Dialog>
                <Alert open={Boolean(message.message)} onClose={() => setMessage("")} color={message?.success ? 'green' : 'red'} className='absolute left-1 bottom-1 w-auto'>
                <p>{message && message.message}</p>
            </Alert>
                </>
  )
}

export default EmployeeForm