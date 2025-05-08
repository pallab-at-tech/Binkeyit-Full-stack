import React from 'react'
import UserMenu from '../component/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {

    const user = useSelector(state => state.user)

    // console.log(user)


    return (
        <section className='bg-white'>
            <div className='container mx-auto p-3 grid lg:grid-cols-[250px_1fr]'>

                {/* left part for menu */}
                <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r border-r-slate-200'>
                    <UserMenu/>
                </div>

                {/* right part for contnt */}
                <div className='bg-white min-h-[75vh]'>
                    <Outlet/>
                </div>

            </div>
        </section>
    )
}

export default Dashboard
